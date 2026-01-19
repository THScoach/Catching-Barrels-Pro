import { calculateKineticFingerprint, calculateScores } from "../lib/scoreCalculations";


// Mock Sensor Data
const mockSensorData = {
    batSpeedMph: 70,
    legsKw: 1000, // Placeholder J
    torsoKw: 300,
    armsKw: 200,
    timeToContact: 0.14,
    xFactor: 45,
    pelvicVelocity: 700,
    maxHandSpeed: 25
};

const mockExitVelocity = 91; // 1.3x efficiency on 70mph bat speed

console.log("=== RUNNING FREEMAN EFFICIENCY ENGINE TESTS ===");

// TEST 1: Efficiency Ratio (Freeman Standard)
const result1 = calculateKineticFingerprint(mockSensorData, mockExitVelocity);
console.log(`Test 1: Efficiency Ratio (Target 1.30): ${result1.freemanRatio}`);

if (result1.freemanRatio >= 1.29 && result1.freemanRatio <= 1.31) {
    console.log("✅ PASS: Freeman Ratio calc is correct.");
} else {
    console.log(`❌ FAIL: Expected 1.30, got ${result1.freemanRatio}`);
}

// TEST 2: Scoring Scale (20-80)
console.log(`Test 2: Bat Score (70mph should be > 50): ${result1.scores.batScore}`);
if (result1.scores.batScore > 50 && result1.scores.batScore < 80) {
    console.log("✅ PASS: 20-80 Scale normalization looks reasonable.");
} else {
    console.log(`❌ FAIL: Score ${result1.scores.batScore} out of expected range.`);
}

// TEST 3: Energy Leak Detection
const leakyData = {
    ...mockSensorData,
    legsKw: 20000, // Excessive Legs Energy -> Low Efficiency
    legsKEPeakTime: -0.15,
    torsoKEPeakTime: -0.10,
    armsKEPeakTime: -0.11 // Arms firing before torso? No, -0.11 < -0.10. Correct order in time (closer to 0 is later). 
    // Wait, negative seconds mean before contact. -0.15 is earliest. -0.10 is later. -0.11 is BEFORE -0.10.
    // So Arms (-0.11) fired BEFORE Torso (-0.10). -> EARLY_ARMS
};
const result3 = calculateKineticFingerprint(leakyData, 80);
console.log(`Test 3: Leak Detection: ${result3.energyLeaks.join(", ")}`);

if (result3.energyLeaks.includes("EARLY_ARMS") || result3.energyLeaks.includes("NO_BAT_DELIVERY")) {
    console.log("✅ PASS: Leak detected correctly.");
} else {
    console.log(`❌ FAIL: Expected energy leak, got ${result3.energyLeaks}`);
}

// TEST 5: Clean Transfer
const cleanData = {
    ...mockSensorData,
    legsKw: 1000,
    batSpeedMph: 75, // Good speed
    legsKEPeakTime: -0.15,
    torsoKEPeakTime: -0.10,
    armsKEPeakTime: -0.05 // Correct order
};
// Check efficiency: BatKE ~ 0.5*0.88*(75*.447)^2 = 494J. Legs=1000J. Ratio=0.49.
// Needs > 1.2 for CLEAN_TRANSFER. Let's lower legsKw or raise speed.
cleanData.legsKw = 300; // Ratio ~ 1.6
const result5 = calculateKineticFingerprint(cleanData, 95);
console.log(`Test 5: Clean Transfer: ${result5.energyLeaks.join(", ")}`);
if (result5.energyLeaks.includes("CLEAN_TRANSFER")) {
    console.log("✅ PASS: Clean Transfer detected.");
} else {
    console.log(`❌ FAIL: Expected CLEAN_TRANSFER, got ${result5.energyLeaks}`);
}

// TEST 4: Calculate Scores (Legacy/Video)
const videoMetrics = {
    barrelRate: 100, // should maximize barrel score
    sweetSpotRate: 100,
    hardHitRate: 100
};
const videoScores = calculateScores(videoMetrics);
console.log(`Test 4: Video Barrel Score: ${videoScores.barrelScore}`);
if (videoScores.barrelScore === 100) { // 0.4 * 100 + 0.6 * 100
    console.log("✅ PASS: Video scoring math holds.");
} else {
    console.log(`❌ FAIL: Expected 100, got ${videoScores.barrelScore}`);
}

console.log("=== ALL TESTS COMPLETED ===");
