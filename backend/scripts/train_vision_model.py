import os
import torch
import torch.nn as nn

class ArogyaVisionCNN(nn.Module):
    def __init__(self, num_classes=3):
        super(ArogyaVisionCNN, self).__init__()
        # Input shape: (3, 128, 128)
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2), # -> (16, 64, 64)
            
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2), # -> (32, 32, 32)
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2), # -> (64, 16, 16)
        )
        self.classifier = nn.Sequential(
            nn.Linear(64 * 16 * 16, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x

def create_and_save_mock_weights():
    print("Initializing PyTorch ArogyaVisionCNN model architecture...")
    model = ArogyaVisionCNN(num_classes=3)
    
    # Save the full model structure + weights
    models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "vision_classifier.pt")
    
    # In PyTorch, we can save the state_dict
    torch.save(model.state_dict(), model_path)
    print(f"PyTorch CNN vision model successfully saved to: {model_path}")

if __name__ == "__main__":
    create_and_save_mock_weights()
