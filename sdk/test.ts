import { AvaxCPoE, CryptoUtils } from './src/index';

async function testAvaxCPoE() {
  console.log('🧪 Testing AVAX-CPoE SDK...\n');

  // Initialize with Avalanche Fuji testnet
  const cpoe = new AvaxCPoE('https://api.avax-test.network/ext/bc/C/rpc');

  console.log('✅ AvaxCPoE instance created');

  // Test utility functions
  console.log('\n🔧 Testing CryptoUtils...');
  
  // Mock some log data for testing
  const mockLogs = [
    {
      address: '0x1234567890123456789012345678901234567890',
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
      data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      logIndex: 0
    },
    {
      address: '0x0987654321098765432109876543210987654321',
      topics: ['0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'],
      data: '0x0000000000000000000000000000000000000000000000001bc16d674ec80000',
      logIndex: 1
    }
  ];

  try {
    const merkleProof = CryptoUtils.generateMerkleProof(mockLogs, 0);
    console.log('✅ Merkle proof generated:', {
      leaf: merkleProof.leaf.substring(0, 20) + '...',
      root: merkleProof.root.substring(0, 20) + '...',
      proofLength: merkleProof.proof.length
    });

    // Verify the proof
    const isValid = CryptoUtils.verifyMerkleProof(
      merkleProof.leaf,
      merkleProof.proof,
      merkleProof.root,
      merkleProof.index
    );
    console.log('✅ Merkle proof verification:', isValid ? 'VALID' : 'INVALID');

    // Test block signature
    const blockHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const validatorSetHash = CryptoUtils.generateValidatorSetHash(12345);
    const signature = CryptoUtils.createBlockSignature(blockHash, validatorSetHash);
    
    console.log('✅ Block signature created:', signature.substring(0, 20) + '...');
    
    const sigValid = CryptoUtils.verifyBlockSignature(blockHash, validatorSetHash, signature);
    console.log('✅ Block signature verification:', sigValid ? 'VALID' : 'INVALID');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  console.log('\n🎉 SDK test completed successfully!');
  console.log('\n📚 Next steps:');
  console.log('   1. Use generateProof() with a real transaction hash');
  console.log('   2. Verify proofs with verifyProof()');
  console.log('   3. Integrate with your DeFi protocol');
}

// Run the test
testAvaxCPoE().catch(console.error);
