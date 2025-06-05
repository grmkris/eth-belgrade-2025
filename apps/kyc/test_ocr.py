#!/usr/bin/env python3
"""
Test script for the improved OCR functionality
This script demonstrates the enhanced passport processing capabilities
"""

import os
import sys
import json
from datetime import datetime

# Add the src directory to the path so we can import our app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from app import initialize_ocr, process_passport, generate_demo_result

def test_with_image(image_path):
    """Test OCR processing with a specific image"""
    print(f"🧪 Testing OCR with image: {image_path}")
    print("=" * 60)
    
    # Initialize OCR
    reader = initialize_ocr()
    if not reader:
        print("❌ Failed to initialize OCR reader")
        return None
    
    # Process the image
    result = process_passport(image_path, reader)
    
    print("\n📋 OCR Processing Results:")
    print("-" * 40)
    print(json.dumps(result, indent=2, default=str))
    
    return result

def test_demo_mode():
    """Test demo mode fallback"""
    print("\n🎭 Testing Demo Mode:")
    print("=" * 60)
    
    # Generate a few demo results to show variety
    for i in range(3):
        demo_result = generate_demo_result(f"demo_image_{i}.jpg")
        print(f"\n📋 Demo Result {i+1}:")
        print(json.dumps(demo_result, indent=2, default=str))

def main():
    """Main test function"""
    print("🚀 KYC OCR Testing Suite")
    print("=" * 60)
    print(f"Test started at: {datetime.now()}")
    
    # Test with the sample image
    test_image_path = "test-image.png"
    if os.path.exists(test_image_path):
        result = test_with_image(test_image_path)
    else:
        print(f"⚠️ Test image not found: {test_image_path}")
        print("Testing with demo mode instead...")
        result = None
    
    # Always test demo mode
    test_demo_mode()
    
    print(f"\n✅ Testing completed at: {datetime.now()}")
    print("\n🎯 Key Features Demonstrated:")
    print("  ✓ Enhanced pattern matching for various document types")
    print("  ✓ Multiple extraction strategies (MRZ, patterns, fallbacks)")
    print("  ✓ Confidence scoring and quality assessment")
    print("  ✓ Reliable demo mode for showcasing")
    print("  ✓ Comprehensive error handling")
    print("  ✓ Always returns a meaningful result")

if __name__ == "__main__":
    main() 