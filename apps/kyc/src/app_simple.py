import json
import os

# ⚠️ Minimal TEE test app

IEXEC_OUT = os.getenv('IEXEC_OUT')
IEXEC_IN = os.getenv('IEXEC_IN', 'input')

def main():
    print("🔐 TEE Test App Starting...")
    
    try:
        # Check for input files
        input_files = []
        if os.path.exists(IEXEC_IN):
            input_files = os.listdir(IEXEC_IN)
            print(f"📁 Found {len(input_files)} input files")
        
        # Create test result
        result = {
            "passport_number": "TEST123",
            "country": "TEST",
            "verified": True,
            "message": "TEE deployment test successful",
            "input_files_found": len(input_files)
        }
        
        # Write result
        if IEXEC_OUT:
            result_path = os.path.join(IEXEC_OUT, 'result.json')
            with open(result_path, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"✅ Result written to {result_path}")
        
        print("🎉 TEE Test App Completed Successfully")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if IEXEC_OUT:
            error_result = {"error": str(e), "verified": False}
            with open(os.path.join(IEXEC_OUT, 'result.json'), 'w') as f:
                json.dump(error_result, f)

if __name__ == "__main__":
    main() 