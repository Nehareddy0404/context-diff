import { ruleBasedFilter, ruleBasedScamCheck, calcSafetyScore } from './helpers';

// ═══ RULE-BASED FILTER TESTS ═══

// Happy path: keeps actionable safety alerts
test("ruleBasedFilter keeps actionable safety alerts", function () {
  const incidents = [
    { id: 1, type: "digital", raw: "Warning: phishing emails targeting local bank users", location: "Downtown", date: "2026-03-07" }
  ];
  const results = ruleBasedFilter(incidents);
  expect(results.length).toBe(1);
  expect(results[0].id).toBe(1);
  expect(results[0].isAI).toBe(false);
  expect(results[0].actionSteps.length).toBeGreaterThan(0);
});

// Edge case: removes off-topic venting
test("ruleBasedFilter removes off-topic venting", function () {
  const incidents = [
    { id: 2, type: "physical", raw: "OMG I am so angry about the potholes, ridiculous!!!", location: "Downtown", date: "2026-03-07" }
  ];
  const results = ruleBasedFilter(incidents);
  expect(results.length).toBe(0);
});

// Severity assignment test
test("ruleBasedFilter assigns correct severity levels", function () {
  const incidents = [
    { id: 1, type: "digital", raw: "Data breach at local hospital", location: "Downtown", date: "2026-03-07" },
    { id: 2, type: "digital", raw: "Phishing email circulating", location: "Downtown", date: "2026-03-07" },
    { id: 3, type: "physical", raw: "Feels unsafe near the park at night", location: "Downtown", date: "2026-03-07" },
  ];
  const results = ruleBasedFilter(incidents);
  expect(results.find(r => r.id === 1).severity).toBe("high");
  expect(results.find(r => r.id === 2).severity).toBe("medium");
  expect(results.find(r => r.id === 3).severity).toBe("low");
});

// ═══ SCAM DETECTOR FALLBACK TESTS ═══

test("ruleBasedScamCheck detects obvious scam patterns", function () {
  const result = ruleBasedScamCheck("Congratulations! You've won a $5000 gift card! Click here to claim your prize immediately!");
  expect(result.verdict).toBe("SCAM");
  expect(result.confidence).toBe("High");
  expect(result.redFlags.length).toBeGreaterThanOrEqual(3);
  expect(result.isAI).toBe(false);
});

test("ruleBasedScamCheck handles legitimate messages", function () {
  const result = ruleBasedScamCheck("Hey, are we still meeting for lunch at noon tomorrow?");
  expect(result.verdict).toBe("LEGITIMATE");
  expect(result.confidence).toBe("Low");
});

// ═══ SAFETY SCORE TESTS ═══

test("calcSafetyScore returns high score for safe location", function () {
  const incidents = [
    { id: 1, type: "digital", raw: "phishing alert", location: "Downtown", date: "2026-03-07" }
  ];
  const score = calcSafetyScore(incidents, "EmptyTown");
  expect(score).toBe(95);
});

test("calcSafetyScore returns lower score for high-incident location", function () {
  const today = new Date().toISOString().split("T")[0];
  const incidents = [
    { id: 1, type: "digital", raw: "data breach confirmed", location: "BadArea", date: today },
    { id: 2, type: "digital", raw: "ransomware attack", location: "BadArea", date: today },
    { id: 3, type: "digital", raw: "phishing scam wave", location: "BadArea", date: today },
  ];
  const score = calcSafetyScore(incidents, "BadArea");
  expect(score).toBeLessThan(70);
});