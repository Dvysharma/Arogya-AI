import { HealthReport } from "./mock-data";

export interface AnalysisInput {
  type: "Symptom" | "Tongue" | "Eye" | "Comprehensive";
  symptoms?: string[];
  symptomText?: string;
  gender?: string;
  age?: number;
  existingDiseases?: string[];
  smoking?: "No" | "Occasionally" | "Regularly";
  alcohol?: "No" | "Occasionally" | "Regularly";
  exercise?: "None" | "1-2 days/week" | "3-5 days/week" | "Daily";
  sleepHours?: number;
  sysBP?: number;
  diaBP?: number;
  bloodSugar?: number;
  bmi?: number;
  familyHistory?: string[];
  imageB64?: string; // base64 representation of uploaded image (if any)
}

export function localAnalyzeHealth(input: AnalysisInput): HealthReport {
  const timestamp = new Date().toISOString();
  const id = "rep-" + Math.floor(Math.random() * 100000);

  // Initialize defaults
  let risk: "Low" | "Medium" | "High" = "Low";
  let score = 95; // Higher score = lower risk (or higher health confidence)
  let title = "";
  let summary = "";
  let findings: string[] = [];
  let recommendations: string[] = [];

  // Parse symptoms
  const symptomList = [...(input.symptoms || [])];
  if (input.symptomText) {
    const textLower = input.symptomText.toLowerCase();
    if (textLower.includes("fever") || textLower.includes("temp") || textLower.includes("chill")) symptomList.push("Fever");
    if (textLower.includes("cough") || textLower.includes("throat") || textLower.includes("cold")) symptomList.push("Cough/Cold");
    if (textLower.includes("chest") || textLower.includes("breath") || textLower.includes("shortness")) symptomList.push("Shortness of Breath");
    if (textLower.includes("headache") || textLower.includes("migraine")) symptomList.push("Headache");
    if (textLower.includes("fatigue") || textLower.includes("tired") || textLower.includes("exhaust")) symptomList.push("Fatigue");
    if (textLower.includes("stomach") || textLower.includes("pain") || textLower.includes("nausea")) symptomList.push("Abdominal Discomfort");
    if (textLower.includes("dizzy") || textLower.includes("lighthead")) symptomList.push("Dizziness");
  }

  if (input.type === "Symptom" || input.type === "Comprehensive") {
    title = "AI Symptom & Lifestyle Assessment";
    
    // Analyze risk factors
    let riskPoints = 0;
    
    // Symptom flags
    const highRiskSymptoms = ["Shortness of Breath", "Chest Pain", "Severe Headache", "Dizziness"];
    const mediumRiskSymptoms = ["Fever", "Abdominal Discomfort", "Chronic Cough"];
    
    const containsHighRisk = symptomList.some(s => highRiskSymptoms.includes(s));
    const containsMediumRisk = symptomList.some(s => mediumRiskSymptoms.includes(s));
    
    if (containsHighRisk) {
      riskPoints += 4;
      findings.push("Presence of potential cardiovascular or respiratory distress symptoms (e.g., Shortness of Breath / Chest Pain).");
    } else if (containsMediumRisk) {
      riskPoints += 2;
      findings.push("Presence of system inflammation or acute symptoms (e.g., Fever, Persistent Cough).");
    } else if (symptomList.length > 0) {
      riskPoints += 1;
      findings.push(`Presence of minor localized symptoms: ${symptomList.join(", ")}.`);
    } else {
      findings.push("No acute symptoms reported by user.");
    }

    // Physiological checks
    if (input.sysBP && input.diaBP) {
      if (input.sysBP >= 140 || input.diaBP >= 90) {
        riskPoints += 3;
        findings.push(`Elevated blood pressure observed (${input.sysBP}/${input.diaBP} mmHg) indicating potential hypertension.`);
        recommendations.push("Monitor blood pressure daily at rest and limit dietary sodium.");
      } else if (input.sysBP >= 130 || input.diaBP >= 80) {
        riskPoints += 1.5;
        findings.push(`Pre-hypertension levels observed (${input.sysBP}/${input.diaBP} mmHg).`);
      } else {
        findings.push("Blood pressure is within the optimal healthy range.");
      }
    }

    if (input.bmi) {
      if (input.bmi >= 30) {
        riskPoints += 2;
        findings.push(`BMI calculations (${input.bmi}) indicate Obesity Class I+.`);
        recommendations.push("Consult a nutritionist to establish a balanced caloric deficit diet and safe exercise regimen.");
      } else if (input.bmi >= 25) {
        riskPoints += 1;
        findings.push(`BMI calculations (${input.bmi}) indicate Overweight status.`);
      } else if (input.bmi < 18.5) {
        riskPoints += 1;
        findings.push(`BMI calculations (${input.bmi}) indicate Underweight status.`);
      } else {
        findings.push("Body Mass Index (BMI) is in the healthy normal range.");
      }
    }

    if (input.sleepHours && input.sleepHours < 6) {
      riskPoints += 1;
      findings.push("Insufficient sleep duration (less than 6 hours per day) which can affect heart rate variability and immune functions.");
      recommendations.push("Adopt a consistent sleep schedule aiming for 7-8 hours of sleep.");
    }

    if (input.smoking === "Regularly") {
      riskPoints += 2.5;
      findings.push("Frequent tobacco/nicotine consumption, raising arterial stiffness and pulmonary risks.");
      recommendations.push("Consider smoking cessation options; smoking significantly escalates cardiovascular risks.");
    }

    // Determine final risk level based on points
    if (riskPoints >= 5) {
      risk = "High";
      score = Math.max(40, 95 - riskPoints * 8 - (input.age && input.age > 50 ? 10 : 0));
      summary = "Assessment indicates elevated health indices. Several cardiovascular, lifestyle, or acute symptom warnings were registered.";
    } else if (riskPoints >= 2) {
      risk = "Medium";
      score = 95 - riskPoints * 9;
      summary = "Assessment registers moderate health indices. Some minor physiological values or lifestyle patterns require optimization.";
    } else {
      risk = "Low";
      score = Math.max(90, 98 - riskPoints * 5);
      summary = "Overall health indices are balanced. Maintain your healthy habits and proceed with standard preventive checkups.";
    }

    // Standard recommendations
    if (symptomList.includes("Fatigue") || symptomList.includes("Cough/Cold")) {
      recommendations.push("Ensure adequate fluid intake (2.5L+ per day) and rest.");
    }
    if (input.exercise === "None" || input.exercise === "1-2 days/week") {
      recommendations.push("Gradually increase physical activity to at least 150 minutes of moderate aerobic exercise per week.");
    }
    recommendations.push("Always share abnormal home readings (like elevated BP) with your primary physician.");
  } 
  
  else if (input.type === "Tongue") {
    title = "AI Tongue Image Analysis";
    
    // Simulate image findings based on mock analysis or input keywords
    const matchesPale = input.symptomText?.toLowerCase().includes("pale") || input.symptomText?.toLowerCase().includes("white");
    const matchesRed = input.symptomText?.toLowerCase().includes("red") || input.symptomText?.toLowerCase().includes("strawberry");
    const matchesCoated = input.symptomText?.toLowerCase().includes("coat") || input.symptomText?.toLowerCase().includes("thick");

    if (matchesRed) {
      risk = "Medium";
      score = 78;
      summary = "AI Visual Analysis detected a red/crimson tongue body with potential inflamed papillae at the tip.";
      findings = [
        "Tongue body appears redder than normal, suggesting systemic heat or localized oral inflammation.",
        "Slightly thin yellow coating detected at the back.",
        "No major cracks or geographic patches found."
      ];
      recommendations = [
        "Avoid spicy, fried, and highly acidic foods for 4-5 days.",
        "Practice daily oral hygiene including gentle tongue scraping.",
        "Stay hydrated with cooling beverages (herbal teas, coconut water).",
        "If redness persists alongside a burning sensation, consult a dentist or doctor."
      ];
    } else if (matchesPale || matchesCoated) {
      risk = "Medium";
      score = 80;
      summary = "AI Visual Analysis detected a pale tongue body accompanied by a moderate white coating.";
      findings = [
        "Pale tongue body, which can indicate slow blood circulation or mild iron deficiency anemia.",
        "Moderate white coating suggesting mild sluggish digestion or dampness.",
        "Visible teeth marks (scallops) on the edges indicating water retention or fatigue."
      ];
      recommendations = [
        "Incorporate warm, easily digestible foods like soups, stews, and ginger tea.",
        "Consider getting a complete blood count (CBC) to screen for iron or vitamin B12 levels.",
        "Limit intake of chilled beverages and heavy dairy products.",
        "Get 7-8 hours of sleep to counter physical fatigue."
      ];
    } else {
      // Default Normal/Low Risk Tongue
      risk = "Low";
      score = 92;
      summary = "AI Visual Analysis detected a healthy light pink tongue body with a thin, clear white coating.";
      findings = [
        "Normal pink color distribution across all zones.",
        "Thin, uniform white coating indicating stable digestive function.",
        "No lesions, scallops, deep cracks, or abnormalities detected."
      ];
      recommendations = [
        "Maintain current balanced diet and oral hygiene practices.",
        "Drink plenty of water throughout the day.",
        "Conduct monthly self-screenings to track visual changes."
      ];
    }
  } 
  
  else if (input.type === "Eye") {
    title = "AI Eye Image Analysis";

    const matchesYellow = input.symptomText?.toLowerCase().includes("yellow") || input.symptomText?.toLowerCase().includes("jaundice");
    const matchesRed = input.symptomText?.toLowerCase().includes("red") || input.symptomText?.toLowerCase().includes("bloodshot") || input.symptomText?.toLowerCase().includes("dry");

    if (matchesYellow) {
      risk = "High";
      score = 65;
      summary = "AI Visual Analysis flagged potential yellowish coloration in the sclera (jaundice screening alert).";
      findings = [
        "Significant yellow pigment detected, primarily localized in the bulbar conjunctiva.",
        "Potential indicator of elevated bilirubin levels or liver/biliary tract fatigue.",
        "Minor blood vessel dilation (redness) also noted."
      ];
      recommendations = [
        "IMPORTANT: Consult a physician immediately to get a Liver Function Test (LFT) and evaluate for jaundice.",
        "Avoid alcohol, heavy greasy foods, and unnecessary medications that stress the liver.",
        "Rest your eyes and monitor if you develop dark urine or pale stools.",
        "Do not use self-prescribed eye drops to mask the color."
      ];
    } else if (matchesRed) {
      risk = "Medium";
      score = 81;
      summary = "AI Visual Analysis detected moderate vascular congestion (bloodshot sclera) in the eye surface.";
      findings = [
        "Substantial redness and dilated blood vessels in the conjunctival area.",
        "Signs highly consistent with ocular strain, dry eye syndrome, or mild allergic conjunctivitis.",
        "No yellowing or corneal cloudiness detected."
      ];
      recommendations = [
        "Apply lubricating eye drops (artificial tears) to soothe dryness.",
        "Reduce screen time and wear UV-protective glasses when outdoors.",
        "Apply a clean, cool compress over closed eyelids for 5-10 minutes to reduce congestion.",
        "Avoid rubbing your eyes; seek medical attention if pain or vision changes occur."
      ];
    } else {
      risk = "Low";
      score = 94;
      summary = "AI Visual Analysis shows clear white sclerae with normal vascular density.";
      findings = [
        "Sclera appears healthy, clear, and white.",
        "Normal, healthy blood vessel structure with no congestion.",
        "Pupil and iris patterns show no immediate visible irregularities."
      ];
      recommendations = [
        "Continue practicing good screen hygiene (20-20-20 rule).",
        "Keep eyes hydrated, especially in air-conditioned environments.",
        "Protect eyes from excess sunlight with UV sunglasses."
      ];
    }
  }

  // Ensure confidence score is rounded
  score = Math.round(score);

  return {
    id,
    date: timestamp,
    type: input.type,
    risk,
    score,
    title,
    summary,
    findings,
    recommendations,
    symptoms: symptomList
  };
}
