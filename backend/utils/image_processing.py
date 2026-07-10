import base64
import io
import cv2
import numpy as np
from PIL import Image

def base64_to_cv2(b64_string):
    # Remove prefix if present
    if "," in b64_string:
        b64_string = b64_string.split(",")[1]
        
    img_data = base64.b64decode(b64_string)
    pil_image = Image.open(io.BytesIO(img_data)).convert("RGB")
    cv2_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    return cv2_image

def preprocess_image(cv2_image, target_size=(128, 128), enhance=True):
    # Resize
    resized = cv2.resize(cv2_image, target_size, interpolation=cv2.INTER_AREA)
    
    if enhance:
        # Convert to LAB color space for CLAHE
        lab = cv2.cvtColor(resized, cv2.COLOR_BGR2LAB)
        l_channel, a_channel, b_channel = cv2.split(lab)
        
        # Apply CLAHE
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l_channel)
        
        # Merge channels and convert back to BGR
        limg = cv2.merge((cl, a_channel, b_channel))
        enhanced = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    else:
        enhanced = resized
        
    # Convert BGR to RGB
    rgb = cv2.cvtColor(enhanced, cv2.COLOR_BGR2RGB)
    
    # Normalize pixel values (0-1) and change shape to channels-first (3, H, W) for PyTorch
    normalized = rgb.astype(np.float32) / 255.0
    tensor_format = np.transpose(normalized, (2, 0, 1))
    
    return tensor_format, rgb
