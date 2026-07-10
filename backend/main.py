import os
import torch
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from utils.image_processing import base64_to_cv2, preprocess_image
from utils.model_loader import load_disease_classifier, load_symptoms_list, load_disease_info, load_vision_model

app = FastAPI(title="Arogya AI - Custom Local ML Service", version="1.0.0")

# Enable CORS for Next.js API route communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models instances cache
disease_model = None
symptoms_list = None
disease_info = None
vision_model = None

@app.on_event("startup")
def startup_event():
    global disease_model, symptoms_list, disease_info, vision_model
    try:
        disease_model = load_disease_classifier()
        symptoms_list = load_symptoms_list()
        disease_info = load_disease_info()
        vision_model = load_vision_model()
        print("All custom ML models loaded successfully.")
    except Exception as e:
        print(f"Error loading models during startup: {e}")

class SymptomRequest(BaseModel):
    age: int
    gender: str
    sleepHours: int
    smoking: str # No, Occasionally, Regularly
    alcohol: str # No, Occasionally, Regularly
    exercise: str # None, 1-2 days/week, 3-5 days/week, Daily
    sysBP: int
    diaBP: int
    bloodSugar: Optional[int] = None
    bmi: float
    symptoms: List[str]
    symptomText: Optional[str] = ""

class ImageRequest(BaseModel):
    type: str # Tongue, Eye
    imageB64: str

@app.post("/analyze/symptoms")
def analyze_symptoms(req: SymptomRequest):
    global disease_model, symptoms_list, disease_info
    if disease_model is None or symptoms_list is None or disease_info is None:
        raise HTTPException(status_code=500, detail="Disease classification model or data index is not loaded.")
        
    try:
        # 1. Convert user's symptoms list to binary one-hot vector
        input_vector = np.zeros(len(symptoms_list))
        symptom_weights = disease_info.get("symptom_weights", {})
        
        total_severity_weight = 0
        
        # We need to map user symptoms to the one-hot columns
        user_symptom_set = {s.strip().replace(' ', '').lower() for s in req.symptoms}
        if req.symptomText:
            # simple keyword matching in description text
            for word in req.symptomText.split():
                clean_word = word.strip().replace(' ', '').lower().replace(',', '').replace('.', '')
                if clean_word:
                    user_symptom_set.add(clean_word)

        # Build feature vector & calculate severity weight
        for sym_name in user_symptom_set:
            if sym_name in symptom_weights:
                idx = symptoms_list.index(sym_name)
                input_vector[idx] = 1
                total_severity_weight += symptom_weights[sym_name]
            else:
                # partial matching (e.g. "headache" matches "headache")
                for listed_sym in symptoms_list:
                    if sym_name in listed_sym or listed_sym in sym_name:
                        idx = symptoms_list.index(listed_sym)
                        input_vector[idx] = 1
                        total_severity_weight += symptom_weights.get(listed_sym, 3)
                        break

        # 2. Run Model Inference
        X = np.array([input_vector])
        pred_class_idx = int(disease_model.predict(X)[0])
        
        # Get predicted disease name
        all_diseases = disease_info.get("diseases", [])
        predicted_disease = all_diseases[pred_class_idx]
        
        # Get details
        info_dict = disease_info.get("disease_info", {})
        d_details = info_dict.get(predicted_disease, {
            "description": "Visual symptoms correlate to disease screening parameters.",
            "precautions": ["Consult a general physician", "Get plenty of rest"]
        })

        # 3. Determine Risk Level based on severity weights
        if total_severity_weight >= 12:
            risk = "High"
            score = max(35, 100 - total_severity_weight * 5 - (req.age // 5))
        elif total_severity_weight >= 5:
            risk = "Medium"
            score = max(65, 100 - total_severity_weight * 5)
        else:
            risk = "Low"
            score = max(88, 100 - max(1, total_severity_weight) * 4)

        score = int(score)

        summary = f"Custom Decision Tree Classifier predicted indicators consistent with {predicted_disease}. {d_details['description']}"
        findings = [
            f"Symptom patterns match screening markers for {predicted_disease}.",
            f"Total cumulative symptom severity index: {total_severity_weight} units."
        ]
        
        # Add vitals warnings if abnormal
        if req.sysBP >= 140 or req.diaBP >= 90:
            findings.append(f"Cardiovascular alert: Elevated blood pressure ({req.sysBP}/{req.diaBP} mmHg) detected.")
            if risk != "High":
                risk = "High"
                score = min(score, 60)
        
        recommendations = d_details["precautions"]
        if not recommendations:
            recommendations = ["Monitor symptoms", "Keep hydrated", "Consult a physician if conditions worsen"]

        return {
            "risk": risk,
            "score": score,
            "title": f"AI Clinical Screening - {predicted_disease}",
            "summary": summary,
            "findings": findings,
            "recommendations": recommendations,
            "symptoms": req.symptoms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image")
def analyze_image(req: ImageRequest):
    global vision_model
    if vision_model is None:
        raise HTTPException(status_code=500, detail="PyTorch CNN model not loaded.")
        
    try:
        # Decode and preprocess image using OpenCV
        cv2_img = base64_to_cv2(req.imageB64)
        tensor_format, _ = preprocess_image(cv2_img, target_size=(128, 128))
        
        # Load into torch tensor
        x = torch.tensor(tensor_format).unsqueeze(0) # add batch size -> (1, 3, 128, 128)
        
        # Model Inference
        with torch.no_grad():
            outputs = vision_model(x)
            probabilities = torch.softmax(outputs, dim=1).numpy()[0]
            class_idx = int(np.argmax(probabilities))
            confidence = float(probabilities[class_idx]) * 100

        risk_levels = ["Low", "Medium", "High"]
        findings = []
        recommendations = []

        if req.type.lower() == "tongue":
            # Classes mapping: 0=Normal, 1=Pale/Coated, 2=Red/Inflamed
            if class_idx == 1:
                risk = "Medium"
                score = 80
                title = "Local CNN Tongue Scan - Pale Coating"
                summary = f"Custom PyTorch CNN (confidence: {confidence:.1f}%) detected pale body textures indicating potential digestive stagnation or iron anemia indices."
                findings = [
                    "Slight discoloration (pale body) showing potential sluggish metabolism.",
                    "White coating concentration near the central digestive zones.",
                    "Minor edge scallops suggesting mild fluid dampness."
                ]
                recommendations = [
                    "Integrate cooked, warm meals (soups, herbal teas) and limit ice-cold drinks.",
                    "Get a routine CBC blood check to review iron and hemoglobin levels.",
                    "Maintain gentle daily tongue cleaning."
                ]
            elif class_idx == 2:
                risk = "Medium"
                score = 76
                title = "Local CNN Tongue Scan - Inflamed RedTip"
                summary = f"Custom PyTorch CNN (confidence: {confidence:.1f}%) detected localized redness suggesting systemic body heat or oral inflammation."
                findings = [
                    "Reddened tongue margins and tip indicating systemic hot symptoms.",
                    "Inflamed papillae visible at the tip.",
                    "Thin, light yellow coating."
                ]
                recommendations = [
                    "Limit spicy, fried, and highly acidic food intake.",
                    "Hydrate with cooling elements (coconut water, green teas).",
                    "Monitor for dental or aphthous ulcers; consult a dentist if irritation continues."
                ]
            else:
                risk = "Low"
                score = 94
                title = "Local CNN Tongue Scan - Normal Pink"
                summary = f"Custom PyTorch CNN (confidence: {confidence:.1f}%) detected a healthy pink tongue body with thin, clear coating."
                findings = [
                    "Normal light-pink color distribution across all zones.",
                    "Thin uniform white coating representing a healthy balanced microbiome.",
                    "No major cracks, scallops, or structural variations detected."
                ]
                recommendations = [
                    "Maintain current oral hygiene habits.",
                    "Stay well hydrated throughout the day.",
                    "Log scans monthly to maintain visual records."
                ]
                
        else: # Eye
            # Classes mapping: 0=Clear, 1=Red/Bloodshot, 2=Yellow/Jaundice
            if class_idx == 1:
                risk = "Medium"
                score = 79
                title = "Local CNN Eye Scan - Ocular Redness"
                summary = f"Custom PyTorch CNN (confidence: {confidence:.1f}%) detected vascular congestion (bloodshot patterns) consistent with dry eye or ocular fatigue."
                findings = [
                    "Dilation of conjunctival blood vessels in the sclera.",
                    "Increased redness density indicating potential screen fatigue.",
                    "Corneal structures appear clear."
                ]
                recommendations = [
                    "Rest eyes using the 20-20-20 screen rule.",
                    "Apply over-the-counter lubricating eye drops.",
                    "Reduce screen brightness and protect eyes from direct wind."
                ]
            elif class_idx == 2:
                risk = "High"
                score = 62
                title = "Local CNN Eye Scan - Sclera Yellowing"
                summary = f"Custom PyTorch CNN (confidence: {confidence:.1f}%) flagged yellow pigment concentrations, requiring clinical jaundice evaluation."
                findings = [
                    "Visible yellowish pigment accumulation in the bulbar conjunctival sclera.",
                    "Potential indicator of hepatic (liver) fatigue or high bilirubin levels."
                ]
                recommendations = [
                    "IMPORTANT: Schedule an appointment with a GP for a Liver Function Test.",
                    "Avoid alcohol and heavy/fatty foods that strain the liver.",
                    "Monitor for other systemic signs (fatigue, color changes in urine/stool)."
                ]
            else:
                risk = "Low"
                score = 95
                title = "Local CNN Eye Scan - Clear Sclera"
                summary = f"Custom PyTorch CNN (confidence: {confidence:.1f}%) detected healthy clear white sclerae."
                findings = [
                    "Clear, healthy white color distribution across both sclera sides.",
                    "Normal vascular density with no red spots or congestion.",
                    "Iris and pupil circles appear normal."
                ]
                recommendations = [
                    "Continue using UV protective sunglasses outdoors.",
                    "Keep eyes hydrated during prolonged reading."
                ]

        return {
            "risk": risk,
            "score": score,
            "title": title,
            "summary": summary,
            "findings": findings,
            "recommendations": recommendations,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
