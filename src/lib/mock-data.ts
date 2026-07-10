export interface HealthReport {
  id: string;
  date: string;
  type: "Symptom" | "Tongue" | "Eye" | "Comprehensive";
  risk: "Low" | "Medium" | "High";
  score: number; // confidence score (0-100)
  title: string;
  summary: string;
  findings: string[];
  recommendations: string[];
  symptoms?: string[];
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  existingDiseases: string[];
  smoking: "No" | "Occasionally" | "Regularly";
  alcohol: "No" | "Occasionally" | "Regularly";
  exercise: "None" | "1-2 days/week" | "3-5 days/week" | "Daily";
  sleepHours: number;
  sysBP: number; // systolic BP
  diaBP: number; // diastolic BP
  bloodSugar?: number;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export const mockUserProfile: UserProfile = {
  name: "Dr. Rohan Sharma",
  email: "rohan.sharma@example.com",
  age: 28,
  gender: "Male",
  bloodGroup: "B+",
  height: "178 cm",
  weight: "74 kg",
  existingDiseases: ["Mild Dust Allergy"],
  smoking: "No",
  alcohol: "Occasionally",
  exercise: "3-5 days/week",
  sleepHours: 7,
  sysBP: 120,
  diaBP: 80,
  bloodSugar: 92,
  emergencyContact: {
    name: "Priya Sharma",
    relation: "Spouse",
    phone: "+91 98765 43210",
  },
};

export const mockReports: HealthReport[] = [
  {
    id: "rep-1",
    date: "2026-07-08T10:30:00Z",
    type: "Tongue",
    risk: "Medium",
    score: 82,
    title: "Tongue Analysis - Pale Coating",
    summary: "Visual analysis shows a pale tongue body with a thin white coating and minor tooth marks on the edges.",
    findings: [
      "Pale tongue body indicating potential slow circulation or mild anemia.",
      "Thin white coating representing normal status, but tooth marks suggest dampness or digestive fatigue.",
      "No structural deviations or severe lesions detected."
    ],
    recommendations: [
      "Incorporate iron-rich foods (spinach, beetroot, lentils) into your diet.",
      "Avoid excess cold or raw foods to support digestive strength.",
      "Ensure proper hydration and log symptoms daily.",
      "Monitor fatigue levels; consult a physician if exhaustion persists."
    ],
    imageUrl: "/images/tongue_sample.jpg",
  },
  {
    id: "rep-2",
    date: "2026-07-02T16:15:00Z",
    type: "Symptom",
    risk: "Low",
    score: 91,
    title: "Symptom Screening - Mild Fatigue",
    summary: "Evaluation of mild headache, fatigue, and dry throat after working long hours.",
    findings: [
      "Symptoms strongly align with mild dehydration and screen-related fatigue.",
      "Lifestyle factors show less than 6 hours of sleep and high caffeine consumption on the day of screening.",
      "No severe red-flag symptoms detected."
    ],
    recommendations: [
      "Increase water intake to at least 2.5 - 3 liters daily.",
      "Follow the 20-20-20 rule for eye strain (look 20 feet away for 20 seconds every 20 minutes).",
      "Aim for 7-8 hours of sound sleep.",
      "Limit caffeine intake past 4:00 PM."
    ],
    symptoms: ["Fatigue", "Mild Headache", "Dry Throat"],
  },
  {
    id: "rep-3",
    date: "2026-06-25T09:00:00Z",
    type: "Eye",
    risk: "High",
    score: 88,
    title: "Eye Analysis - Sclera Redness & Yellowing",
    summary: "Visual scanning indicates moderate sclera redness accompanied by localized yellow pigment concentration near the inner corners.",
    findings: [
      "Significant vascular congestion (redness) in both eyes.",
      "Subtle yellowing of the sclera (jaundice indicator) that requires medical observation.",
      "Slight dry eye signs present."
    ],
    recommendations: [
      "IMPORTANT: Schedule an appointment with a general practitioner or ophthalmologist to check liver enzyme levels and eye health.",
      "Avoid rubbing your eyes to prevent further irritation or corneal scratches.",
      "Use lubricating preservative-free eye drops if dry eye feels uncomfortable.",
      "Reduce screen exposure and get a comprehensive blood panel done."
    ],
    imageUrl: "/images/eye_sample.jpg",
  }
];

export const healthTips = [
  "Stay Hydrated: Dehydration is a common cause of daytime fatigue and brain fog. Try to keep a bottle of water next to you.",
  "Rest Your Eyes: Follow the 20-20-20 rule. For every 20 minutes of screen time, look at something 20 feet away for 20 seconds.",
  "Check Your Tongue: In traditional systems, a healthy tongue is pink with a thin white coating. Pale, red, or heavily coated tongues can reflect internal balance.",
  "Watch the Sclera: Clear white sclerae indicate good health. Redness can mean eye strain or inflammation, while yellowing is a key warning for liver fatigue.",
  "Prioritize Sleep: Consistently getting less than 7 hours of sleep is linked to reduced immunity, weight gain, and cardiovascular stress."
];

export const mockDashboardStats = {
  healthScore: 78,
  scoreChange: "+3% from last month",
  latestAnalysis: "July 8, 2026",
  completedAssessments: 12,
  alertsCount: 1, // yellowing of eye is a high risk alert
  riskDistribution: [
    { name: "Low Risk", value: 8, color: "#10B981" },
    { name: "Medium Risk", value: 3, color: "#0EA5E9" },
    { name: "High Risk", value: 1, color: "#EF4444" }
  ],
  scoreHistory: [
    { month: "Feb", score: 72 },
    { month: "Mar", score: 75 },
    { month: "Apr", score: 70 },
    { month: "May", score: 76 },
    { month: "Jun", score: 75 },
    { month: "Jul", score: 78 }
  ]
};
