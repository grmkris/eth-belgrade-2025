# 🚀 TDX Deployment Guide for ETH Belgrade 2025

This guide implements the official hackathon documentation for deploying iApps with TDX (Trusted Data eXchange) support.

## 📋 **Prerequisites**

1. Your iApp code is ready (✅ Already completed)
2. Enhanced OCR processing is implemented (✅ Already completed)
3. DataProtector integration is configured (✅ Already completed)

## 🔧 **TDX Configuration Steps**

### Step 1: Deploy iApp with TDX Support

Set the experimental TDX environment variable and deploy:

```bash
# Navigate to your iApp directory
cd apps/kyc

# Deploy with TDX experimental feature
EXPERIMENTAL_TDX_APP=true iexec app deploy

# Alternative if you have a package.json script:
npm run deploy:tdx
```

### Step 2: DataProtector SDK Configuration ✅

The DataProtector SDK is already configured with the TDX labs SMS endpoint:

```typescript
// ✅ Already implemented in teeService.ts
this.dataProtector = new IExecDataProtector(provider, {
  iexecOptions: {
    smsURL: 'https://sms.labs.iex.ec', // TDX labs SMS endpoint
  },
});
```

### Step 3: Workerpool Configuration ✅

The TDX workerpool is already specified in the processing call:

```typescript
// ✅ Already implemented in teeService.ts
const processingResult = await dataProtector.core.processProtectedData({
  protectedData: protectedData.address,
  app: DEPLOYED_IAPP_ADDRESS,
  maxPrice: 0,
  args: "process_passport",
  inputFiles: [],
  workerpool: 'prod-v8-bellecour.main.pools.iexec.eth' // TDX workerpool
});
```

## 🧪 **Testing the TDX Setup**

1. **Deploy with TDX flag**:
   ```bash
   EXPERIMENTAL_TDX_APP=true iexec app deploy
   ```

2. **Update your app address** in the frontend if needed:
   ```typescript
   // In teeService.ts - update if you get a new deployment address
   const DEPLOYED_IAPP_ADDRESS = '0x77E4126768A17585170f0Fe190f052327070babE';
   ```

3. **Test the complete flow**:
   - Upload an image in your frontend
   - Verify DataProtector protection works
   - Check that processing uses the TDX workerpool
   - Confirm enhanced OCR results are returned

## ✅ **Expected Results**

After proper TDX configuration, you should see:

```
📡 Processing protected data with DataProtector...
✅ DataProtector processing initiated successfully!
Task ID: [real_task_id]
Deal ID: [real_deal_id]
```

Instead of fallback errors like:
- "Dataset encryption key is not set"
- "Dataset address mismatch"

## 🔍 **Troubleshooting**

### If deployment fails:
```bash
# Check iExec CLI version
iexec --version

# Ensure you're on Bellecour network
iexec wallet show

# Verify your iApp configuration
cat iexec.json
```

### If processing still fails:
1. Verify the SMS endpoint is reachable: `https://sms.labs.iex.ec`
2. Check that your app address matches the deployed TDX app
3. Confirm the workerpool is available: `prod-v8-bellecour.main.pools.iexec.eth`

## 🎯 **Ready for ETH Belgrade!**

Once deployed with TDX support, your complete KYC system will:
- ✅ Protect passport images with DataProtector
- ✅ Process them through TDX TEE environment
- ✅ Extract data with enhanced OCR patterns
- ✅ Return professional verification results
- ✅ Handle all edge cases gracefully

Perfect for hackathon demonstrations! 🇷🇸🎉 