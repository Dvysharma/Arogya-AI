import os
import pickle
import json
import torch
from scripts.train_vision_model import ArogyaVisionCNN

def load_disease_classifier():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    model_path = os.path.join(base_dir, "models", "disease_classifier.pkl")
    
    if not os.path.exists(model_path):
        print(f"Disease model weights not found at {model_path}. Training now...")
        from scripts.train_symptom_classifier import train_and_save_classifier
        train_and_save_classifier()
        
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    return model

def load_symptoms_list():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    list_path = os.path.join(base_dir, "models", "symptoms_list.pkl")
    with open(list_path, "rb") as f:
        symptoms_list = pickle.load(f)
    return symptoms_list

def load_disease_info():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    info_path = os.path.join(base_dir, "models", "disease_info.json")
    with open(info_path, "r") as f:
        info = json.load(f)
    return info

def load_vision_model():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    model_path = os.path.join(base_dir, "models", "vision_classifier.pt")
    
    if not os.path.exists(model_path):
        print(f"Vision model weights not found at {model_path}. Generating mock weights...")
        from scripts.train_vision_model import create_and_save_mock_weights
        create_and_save_mock_weights()
        
    model = ArogyaVisionCNN(num_classes=3)
    model.load_state_dict(torch.load(model_path))
    model.eval() # Set to evaluation mode
    return model

