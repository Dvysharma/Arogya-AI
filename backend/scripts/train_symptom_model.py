import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # Generate random features
    age = np.random.randint(18, 80, size=num_samples)
    gender = np.random.randint(0, 2, size=num_samples) # 0: Male, 1: Female
    sleep = np.random.randint(4, 10, size=num_samples)
    smoking = np.random.randint(0, 3, size=num_samples) # 0: No, 1: Occ, 2: Reg
    alcohol = np.random.randint(0, 3, size=num_samples) # 0: No, 1: Occ, 2: Reg
    exercise = np.random.randint(0, 4, size=num_samples) # 0: None, 1: 1-2, 2: 3-5, 3: Daily
    
    sys_bp = np.random.randint(90, 180, size=num_samples)
    dia_bp = np.random.randint(60, 110, size=num_samples)
    bmi = np.random.uniform(15.0, 40.0, size=num_samples)
    
    # Features matrix: X
    X = np.column_stack((age, gender, sleep, smoking, alcohol, exercise, sys_bp, dia_bp, bmi))
    
    # Calculate Risk Score (synthetic rule to assign label)
    y = []
    for i in range(num_samples):
        points = 0
        if sys_bp[i] >= 140 or dia_bp[i] >= 90: points += 3
        elif sys_bp[i] >= 130 or dia_bp[i] >= 80: points += 1
        
        if bmi[i] >= 30: points += 2
        elif bmi[i] >= 25: points += 1
        
        if sleep[i] < 6: points += 1
        if smoking[i] == 2: points += 2
        if exercise[i] == 0: points += 1
        
        # Risk thresholds
        if points >= 5:
            y.append(2) # High Risk
        elif points >= 2:
            y.append(1) # Medium Risk
        else:
            y.append(0) # Low Risk
            
    return X, np.array(y)

def train_and_save_model():
    print("Generating synthetic patient dataset...")
    X, y = generate_synthetic_data(1200)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    model.fit(X, y)
    
    # Create directory if not exists
    models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "symptom_rf.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
        
    print(f"Symptom model successfully saved to: {model_path}")

if __name__ == "__main__":
    train_and_save_model()
