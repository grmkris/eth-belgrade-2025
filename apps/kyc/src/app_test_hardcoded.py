import json
import os
import sys
import re
import base64
import time
from io import BytesIO

# Add iExec DataProtector for fetching protected data
try:
    # We'll simulate the DataProtector fetch for local testing
    from PIL import Image
    import easyocr
    DEPENDENCIES_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Missing dependencies: {e}")
    DEPENDENCIES_AVAILABLE = False

# ⚠️ Hardcoded protected data address for testing
HARDCODED_PROTECTED_DATA = "0x47Ca0D66c06AE3D29e0Fcda0f49c6354FA350e5e"

IEXEC_OUT = os.getenv('IEXEC_OUT', 'output')
IEXEC_IN = os.getenv('IEXEC_IN', 'input')

def fetch_protected_data_mock():
    """
    Mock function to simulate fetching protected data.
    In real TEE, this would be automatically provided by iExec.
    """
    print(f"🔍 Fetching protected data from: {HARDCODED_PROTECTED_DATA}")
    
    # For local testing, we'll create a mock response
    # In real TEE, the decrypted data would be in IEXEC_IN
    mock_data = {
        "passport_image_1": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",  # Tiny test image
        "datasetType": "passport-images",
        "version": "1.0.0",
        "totalFiles": "1",
        "purpose": "kyc-verification",
        "primaryFileName": "test_passport.png",
        "primaryFileSize": "75881",
        "primaryFileType": "image/png"
    }
    
    return mock_data

def initialize_ocr():
    """Initialize EasyOCR reader with English language support"""
    if not DEPENDENCIES_AVAILABLE:
        print("⚠️ EasyOCR not available, using mock OCR")
        return None
        
    try:
        reader = easyocr.Reader(['en'], gpu=False)
        return reader
    except Exception as e:
        print(f"Error initializing OCR: {e}")
        return None

def mock_ocr_processing(image_data):
    """Mock OCR processing that returns test passport data"""
    print("🔍 Performing mock OCR processing...")
    
    # Simulate processing time
    time.sleep(1)
    
    # Return realistic test data based on your actual image
    return {
        "passport_number": "L898902C3",
        "country": "DEU", 
        "verified": True,
        "confidence": 0.95,
        "processing_method": "mock_ocr_for_testing"
    }

def process_passport_with_ocr(image_data, reader):
    """
    Process passport image and extract passport number and country code
    """
    try:
        if not DEPENDENCIES_AVAILABLE or reader is None:
            # Use mock OCR when dependencies not available
            return mock_ocr_processing(image_data)
            
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        
        print(f"📷 Processing image: {image.size} pixels")
            
        # Convert PIL image to format EasyOCR can handle
        import numpy as np
        image_array = np.array(image)
        
        # Read text from image using EasyOCR
        results = reader.readtext(image_array)
        
        # Extract passport number and country
        passport_number = None
        country = None
        
        for (bbox, text, confidence) in results:
            text = text.strip().upper()
            print(f"OCR found: '{text}' (confidence: {confidence:.2f})")
            
            # Look for passport number pattern
            if re.match(r'^[A-Z0-9]{8,9}$', text) and confidence > 0.7:
                passport_number = text
                
            # Look for country codes
            if text in ['DEU', 'GER', 'USA', 'GBR', 'FRA'] and confidence > 0.7:
                country = text
        
        return {
            "passport_number": passport_number or "L898902C3",  # Fallback
            "country": country or "DEU",  # Fallback
            "verified": passport_number is not None,
            "confidence": 0.85,
            "processing_method": "easyocr"
        }
        
    except Exception as e:
        print(f"Error in OCR processing: {e}")
        return mock_ocr_processing(image_data)

def main():
    print("🔐 TEE Hardcoded Test App Starting...")
    print(f"📍 Using hardcoded protected data: {HARDCODED_PROTECTED_DATA}")
    
    try:
        # Create output directory
        os.makedirs(IEXEC_OUT, exist_ok=True)
        
        # Fetch protected data (mocked for local testing)
        protected_data = fetch_protected_data_mock()
        print(f"✅ Protected data fetched: {protected_data['datasetType']}")
        
        # Initialize OCR
        reader = initialize_ocr()
        
        # Process the primary passport image
        if 'passport_image_1' in protected_data:
            image_data = protected_data['passport_image_1']
            ocr_result = process_passport_with_ocr(image_data, reader)
            
            # Create final result
            result = {
                "wallet": "0x3938d5d8CdA5863d5Bb7907A9cd64010229Bd564",  # Your wallet
                "passport_number": ocr_result["passport_number"],
                "country": ocr_result["country"],
                "verified": ocr_result["verified"],
                "confidence": ocr_result.get("confidence", 0.0),
                "processing_method": ocr_result.get("processing_method", "unknown"),
                "protected_data_address": HARDCODED_PROTECTED_DATA,
                                 "timestamp": int(time.time())
            }
        else:
            result = {
                "error": "No passport image found in protected data",
                "verified": False,
                "protected_data_address": HARDCODED_PROTECTED_DATA
            }
        
        # Write result
        result_path = os.path.join(IEXEC_OUT, 'result.json')
        with open(result_path, 'w') as f:
            json.dump(result, f, indent=2)
            
        print(f"✅ Result written to {result_path}")
        print(f"🎉 OCR Result: {result['passport_number']} from {result['country']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        
        # Write error result
        error_result = {
            "error": str(e),
            "verified": False,
            "protected_data_address": HARDCODED_PROTECTED_DATA
        }
        
        result_path = os.path.join(IEXEC_OUT, 'result.json')
        with open(result_path, 'w') as f:
            json.dump(error_result, f)

if __name__ == "__main__":
    main() 