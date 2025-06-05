#!/usr/bin/env python3
"""
Quick test of OCR functionality with driver's license image
"""

import os
import sys
import json

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from app import initialize_ocr, process_passport

def main():
    print("🚗 Testing KYC OCR with Driver's License Image")
    print("=" * 60)
    
    # Initialize OCR
    reader = initialize_ocr()
    if not reader:
        print("❌ Failed to initialize OCR reader")
        return
    
    # Test with driver's license image
    image_path = "driver-license-test.png"
    
    if os.path.exists(image_path):
        print(f"📄 Processing: {image_path}")
        result = process_passport(image_path, reader)
        
        print("\n🎯 Results:")
        print("-" * 40)
        print(json.dumps(result, indent=2, default=str))
        
        print(f"\n✅ Extracted Data:")
        print(f"   Document Number: {result.get('passport_number', 'N/A')}")
        print(f"   Country/State: {result.get('country', 'N/A')}")
        print(f"   Name: {result.get('name', 'N/A')}")
        print(f"   Verified: {result.get('verified', False)}")
        print(f"   Confidence: {result.get('confidence_score', 0):.2f}")
        print(f"   Method: {result.get('extraction_method', 'unknown')}")
        
    else:
        print(f"❌ Image not found: {image_path}")
        print("Make sure the image file exists in the current directory")

if __name__ == "__main__":
    main() 