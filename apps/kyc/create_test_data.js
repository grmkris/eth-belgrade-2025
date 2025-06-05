const { IExecDataProtector } = require('@iexec/dataprotector');
const { ethers } = require('ethers');
const fs = require('fs');

// Read the wallet from iapp.config.json
const config = JSON.parse(fs.readFileSync('iapp.config.json', 'utf8'));

async function createTestProtectedData() {
  try {
    console.log('🔐 Creating test protected data with CLI wallet...');
    console.log('Wallet address:', config.walletAddress);
    
    // Create provider and signer from the CLI wallet
    const provider = new ethers.JsonRpcProvider('https://bellecour.iex.ec');
    const signer = new ethers.Wallet(config.walletPrivateKey, provider);
    
    // Initialize DataProtector with the CLI wallet
    const dataProtector = new IExecDataProtector(signer);
    
    // Create a simple test passport data 
    const testData = {
      passport_image_1: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", // Tiny test image
      datasetType: 'passport-images',
      version: '1.0.0',
      totalFiles: '1',
      uploadTimestamp: Date.now().toString(),
      purpose: 'kyc-verification',
      processingType: 'ocr-passport-extraction',
      primaryFileName: 'test_passport.png',
      primaryFileSize: '150',
      primaryFileType: 'image/png'
    };
    
    console.log('📄 Creating protected data...');
    const protectedData = await dataProtector.core.protectData({
      data: testData,
      name: `CLI-Test-KYC-${Date.now()}`
    });
    
    console.log('✅ Test protected data created!');
    console.log('Protected data address:', protectedData.address);
    console.log('');
    console.log('🚀 Now you can test with:');
    console.log(`EXPERIMENTAL_TDX_APP=true iapp run ${config.appAddress || '0x75b462c8BD37455750E5f8ce17AC54dF8736E76c'} --protectedData ${protectedData.address}`);
    
    // Save to file for reference
    fs.writeFileSync('test_protected_data.json', JSON.stringify({
      address: protectedData.address,
      createdAt: new Date().toISOString(),
      wallet: config.walletAddress
    }, null, 2));
    
    console.log('📁 Info saved to test_protected_data.json');
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
}

createTestProtectedData(); 