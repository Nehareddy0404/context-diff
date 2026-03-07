const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;

export function ruleBasedFilter(incidents) {
    const noiseKw = ["angry", "lol", "pizza", "ridiculous", "omg", "off topic", "coffee shop", "recommend", "love the"];
    const actionKw = ["phishing", "breach", "scam", "warning", "unsafe", "fake", "heads up", "hacked", "ransomware", "theft", "suspicious", "smishing", "deepfake", "compromised"];
    return incidents
        .filter(inc => {
            const t = inc.raw.toLowerCase();
            const isNoise = noiseKw.some(k => t.includes(k));
            const isAction = actionKw.some(k => t.includes(k));
            return !isNoise || isAction;
        })
        .map(inc => ({
            ...inc,
            summary: inc.raw,
            actionSteps: inc.type === "digital"
                ? ["Change related passwords immediately", "Enable two-factor authentication", "Report to FTC at reportfraud.ftc.gov"]
                : ["Report to local authorities", "Alert your neighbors", "Document with photos if safe"],
            severity: /breach|ransomware|compromised/i.test(inc.raw) ? "high" : /phishing|scam|fake|smishing/i.test(inc.raw) ? "medium" : "low",
            isAI: false, isNoise: false
        }));
}

export function ruleBasedScamCheck(text) {
    const t = text.toLowerCase();
    const urgency = ["act now", "limited time", "immediately", "urgent", "expire", "hurry", "last chance"];
    const money = ["gift card", "wire", "bitcoin", "payment", "prize", "won", "lottery", "inheritance", "guaranteed returns"];
    const phish = ["click here", "verify your", "confirm your", "update your", "suspended", "unauthorized", "ssn", "social security"];
    const flags = [];
    urgency.forEach(k => { if (t.includes(k)) flags.push("Urgency language: '" + k + "'"); });
    money.forEach(k => { if (t.includes(k)) flags.push("Financial bait: '" + k + "'"); });
    phish.forEach(k => { if (t.includes(k)) flags.push("Phishing indicator: '" + k + "'"); });
    if (/https?:\/\/[^\s]+/i.test(t)) flags.push("Contains suspicious URL");
    if (/\b\d{4,}\b/.test(t) && /card|account|ssn/i.test(t)) flags.push("Requests sensitive numbers");
    const score = flags.length;
    return {
        verdict: score >= 3 ? "SCAM" : score >= 1 ? "SUSPICIOUS" : "LEGITIMATE",
        confidence: score >= 3 ? "High" : score >= 1 ? "Medium" : "Low",
        explanation: score >= 3 ? "Multiple scam indicators detected. This message shows classic fraud patterns." : score >= 1 ? "Some suspicious elements found. Exercise caution with this message." : "No obvious scam indicators found, but always verify independently.",
        redFlags: flags.length ? flags : ["No red flags detected"],
        whatToDo: score >= 1 ? ["Do not click any links", "Do not share personal info", "Report to FTC at reportfraud.ftc.gov"] : ["Still verify sender identity", "Never share passwords", "When in doubt, contact the company directly"],
        isAI: false
    };
}

export function calcSafetyScore(incidents, location) {
    const local = incidents.filter(i => i.location === location);
    if (local.length === 0) return 95;
    const now = new Date();
    let penalty = 0;
    local.forEach(i => {
        const days = Math.max(0, (now - new Date(i.date)) / 86400000);
        const recency = Math.max(0.2, 1 - days / 7);
        const sev = /breach|ransomware|compromised/i.test(i.raw) ? 12 : /phishing|scam|fake/i.test(i.raw) ? 8 : 5;
        penalty += sev * recency;
    });
    return Math.max(5, Math.min(95, Math.round(95 - penalty)));
}

export function getTrendData(incidents, location) {
    const local = incidents.filter(i => i.location === location);
    const allDates = [...new Set(incidents.map(i => i.date))].sort();
    const last7 = allDates.slice(-7);
    const days = {};
    last7.forEach(d => { days[d] = { digital: 0, physical: 0 }; });
    local.forEach(i => { if (days[i.date]) days[i.date][i.type]++; });
    return Object.entries(days).map(([date, counts]) => ({ date, ...counts, total: counts.digital + counts.physical }));
}

export async function getAIDigest(incidents) {
    const text = incidents.map(i => "- [" + i.type + "] (id:" + i.id + ") " + i.raw).join("\n");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + OPENAI_API_KEY },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", max_tokens: 1500, messages: [
                { role: "system", content: "You are a calm community safety assistant. Return ONLY valid JSON." },
                { role: "user", content: "Analyze these reports and filter signal from noise:\n" + text + '\n\nReturn: {"filtered":[{"id":1,"summary":"calm 1-sentence summary","severity":"low|medium|high","actionSteps":["step1","step2","step3"],"isNoise":false,"defenseChecklist":["item1","item2","item3"]}]}\n\nRules: mark venting/off-topic as isNoise:true. Digital threats get password/account security steps. severity: high for breaches/ransomware, medium for phishing/scams, low for physical non-urgent.' }
            ]
        })
    });
    if (!res.ok) throw new Error("API " + res.status);
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content.replace(/```json|```/g, "").trim());
    return parsed.filtered.map(f => ({ ...incidents.find(i => i.id === f.id), ...f, isAI: true }));
}

export async function detectScamAI(text) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + OPENAI_API_KEY },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", max_tokens: 600, messages: [
                { role: "system", content: "You are a cybersecurity expert. Return ONLY valid JSON." },
                { role: "user", content: 'Analyze if this is a scam:\n"' + text + '"\n\nReturn: {"verdict":"SCAM|LEGITIMATE|SUSPICIOUS","confidence":"High|Medium|Low","explanation":"2 sentences","redFlags":["flag1"],"whatToDo":["action1","action2"]}' }
            ]
        })
    });
    const data = await res.json();
    return { ...JSON.parse(data.choices[0].message.content.replace(/```json|```/g, "").trim()), isAI: true };
}

export async function askAssistant(question, incidents, location) {
    const ctx = incidents.slice(0, 8).map(i => "- [" + i.type + "] " + i.raw).join("\n");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + OPENAI_API_KEY },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", max_tokens: 400, messages: [
                { role: "system", content: "You are a calm community safety assistant for " + location + ". Be concise and empowering." },
                { role: "user", content: "Recent incidents in " + location + ":\n" + ctx + "\n\nQuestion: " + question }
            ]
        })
    });
    const data = await res.json();
    return data.choices[0].message.content;
}

export async function getAIForecast(incidents, locations) {
    const summary = locations.map(loc => {
        const local = incidents.filter(i => i.location === loc);
        return loc + ": " + local.length + " incidents (" + local.filter(i => i.type === "digital").length + " digital, " + local.filter(i => i.type === "physical").length + " physical)";
    }).join("\n");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + OPENAI_API_KEY },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", max_tokens: 800, messages: [
                { role: "system", content: "You are a predictive threat intelligence analyst. Return ONLY valid JSON." },
                { role: "user", content: "Based on these community incident patterns:\n" + summary + "\n\nForecast the next 7 days. Return:\n{\"predictions\":[{\"location\":\"name\",\"riskLevel\":\"high|medium|low\",\"predictedThreats\":[\"threat1\"],\"recommendation\":\"1 sentence advice\"}],\"overallTrend\":\"increasing|stable|decreasing\",\"topRisk\":\"1 sentence about biggest concern\",\"aiInsight\":\"1 sentence surprising pattern the AI noticed\"}" }
            ]
        })
    });
    if (!res.ok) throw new Error("API " + res.status);
    const data = await res.json();
    return { ...JSON.parse(data.choices[0].message.content.replace(/```json|```/g, "").trim()), isAI: true };
}

export function ruleBasedForecast(incidents, locations) {
    const predictions = locations.map(loc => {
        const local = incidents.filter(i => i.location === loc);
        const digCt = local.filter(i => i.type === "digital").length;
        const physCt = local.filter(i => i.type === "physical").length;
        const total = local.length;
        const riskLevel = total >= 4 ? "high" : total >= 2 ? "medium" : "low";
        const threats = [];
        if (digCt > physCt) threats.push("Elevated digital threat activity (phishing, scams)");
        if (physCt > digCt) threats.push("Increased physical safety concerns");
        if (local.some(i => /breach|ransomware/i.test(i.raw))) threats.push("Ongoing data breach follow-up attacks likely");
        if (local.some(i => /scam|phishing/i.test(i.raw))) threats.push("Continued scam campaigns expected");
        if (!threats.length) threats.push("Normal activity levels expected");
        const rec = riskLevel === "high" ? "Stay vigilant and report suspicious activity immediately" : riskLevel === "medium" ? "Monitor local updates and enable 2FA on accounts" : "Low risk area — maintain standard precautions";
        return { location: loc, riskLevel, predictedThreats: threats, recommendation: rec };
    });
    const totalAll = incidents.length;
    const highRiskLocs = predictions.filter(p => p.riskLevel === "high");
    return {
        predictions,
        overallTrend: totalAll > 15 ? "increasing" : totalAll > 8 ? "stable" : "decreasing",
        topRisk: highRiskLocs.length ? highRiskLocs[0].location + " shows elevated threat patterns requiring attention" : "No critical hotspots detected across monitored areas",
        aiInsight: "Digital threats outnumber physical incidents " + Math.round(incidents.filter(i => i.type === "digital").length / Math.max(1, incidents.length) * 100) + "% — focus cybersecurity training",
        isAI: false
    };
}
