import os
import json
import pickle
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier

def train_and_save_classifier():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_dir = os.path.join(base_dir, "data", "symptoms")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    # 1. Load the raw files
    dataset_path = os.path.join(data_dir, "dataset.csv")
    severity_path = os.path.join(data_dir, "Symptom-severity.csv")
    description_path = os.path.join(data_dir, "symptom_Description.csv")
    precaution_path = os.path.join(data_dir, "symptom_precaution.csv")

    if not os.path.exists(dataset_path):
        print(f"Error: dataset.csv not found at {dataset_path}")
        return

    # Load severity weights to get list of unique symptoms
    sev_df = pd.read_csv(severity_path)
    # Standardize symptom names (strip spaces, lowercase)
    sev_df['Symptom'] = sev_df['Symptom'].str.replace(' ', '').str.lower()
    symptoms_list = sorted(sev_df['Symptom'].unique().tolist())
    symptom_to_idx = {sym: idx for idx, sym in enumerate(symptoms_list)}

    # Save symptoms index mapping
    with open(os.path.join(models_dir, "symptoms_list.pkl"), "wb") as f:
        pickle.dump(symptoms_list, f)

    # Load main dataset
    df = pd.read_csv(dataset_path)
    df.columns = [c.strip() for c in df.columns]

    # Convert symptom rows into binary vectors (one-hot)
    X = []
    y = []

    # Map disease names to classes
    diseases = sorted(df['Disease'].unique().tolist())
    disease_to_class = {d: idx for idx, d in enumerate(diseases)}
    class_to_disease = {idx: d for idx, d in enumerate(diseases)}

    for idx, row in df.iterrows():
        disease = row['Disease']
        y.append(disease_to_class[disease])
        
        # Create binary feature vector
        vector = np.zeros(len(symptoms_list))
        # Iterate over all symptom columns
        for col in df.columns[1:]:
            val = row[col]
            if pd.notna(val) and str(val).strip() != "":
                clean_val = str(val).replace(' ', '').lower().strip()
                if clean_val in symptom_to_idx:
                    vector[symptom_to_idx[clean_val]] = 1
        X.append(vector)

    X = np.array(X)
    y = np.array(y)

    print(f"Training dataset shape: X={X.shape}, y={y.shape}")

    # 2. Train a Decision Tree Classifier (extremely accurate for this structured logic)
    model = DecisionTreeClassifier(random_state=42)
    model.fit(X, y)

    # Save model weights
    with open(os.path.join(models_dir, "disease_classifier.pkl"), "wb") as f:
        pickle.dump(model, f)
    print("Disease classifier model successfully trained and saved.")

    # 3. Create a dictionary for disease descriptions and precautions
    desc_df = pd.read_csv(description_path)
    prec_df = pd.read_csv(precaution_path)

    disease_info = {}
    
    # Fill descriptions
    for _, row in desc_df.iterrows():
        d_name = row['Disease'].strip()
        disease_info[d_name] = {
            "description": row['Description'].strip(),
            "precautions": []
        }

    # Fill precautions
    for _, row in prec_df.iterrows():
        d_name = row['Disease'].strip()
        prec_list = []
        for col in ['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']:
            if pd.notna(row[col]) and str(row[col]).strip() != "":
                prec_list.append(str(row[col]).strip().capitalize())
        if d_name in disease_info:
            disease_info[d_name]["precautions"] = prec_list
        else:
            disease_info[d_name] = {
                "description": "No description available.",
                "precautions": prec_list
            }

    # Save mappings
    with open(os.path.join(models_dir, "disease_info.json"), "w") as f:
        json.dump({
            "diseases": diseases,
            "disease_info": disease_info,
            "symptom_weights": dict(zip(sev_df['Symptom'], sev_df['weight'].astype(int)))
        }, f, indent=2)

    print("Disease description and precautions mapping JSON saved successfully.")

if __name__ == "__main__":
    train_and_save_classifier()
