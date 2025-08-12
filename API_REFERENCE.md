# 📖 CrossLend SDK API Reference
## Complete API Documentation for Privacy-Preserving Development

---

## 🔐 **ProductionZKProofGenerator**

### **Constructor**
```typescript
new ProductionZKProofGenerator(circuitPath?: string, provingKeyPath?: string)
```

**Parameters:**
- `circuitPath` (optional): Path to custom Circom circuit file
- `provingKeyPath` (optional): Path to custom proving key

**Example:**
```typescript
// Use default circuit
const zkGen = new ProductionZKProofGenerator();

// Use custom circuit
const customZK = new ProductionZKProofGenerator(
    './circuits/my-circuit.circom',
    './keys/my-key.zkey'
);
```

### **generateProductionProof()**
```typescript
async generateProductionProof(
    privateInputs: PrivateInputs,
    publicInputs: PublicInputs
): Promise<ZKProof>
```

**Parameters:**
- `privateInputs`: Secret data (never revealed)
- `publicInputs`: Public constraints and thresholds

**Returns:** Complete zero-knowledge proof object

**Example:**
```typescript
const proof = await zkGen.generateProductionProof({
    actualAmount: "5000000000000000000",  // 5 AVAX (secret)
    userSecret: "my-private-seed",
    merklePathElements: merkleProof.path,
    merklePathIndices: merkleProof.indices
}, {
    minAmount: "1000000000000000000",     // 1 AVAX (public)
    merkleRoot: merkleProof.root,
    nullifierHash: nullifierCommitment
});
```

### **verifyProof()**
```typescript
async verifyProof(proof: ZKProof): Promise<boolean>
```

**Parameters:**
- `proof`: ZK proof object to verify

**Returns:** `true` if proof is valid, `false` otherwise

**Example:**
```typescript
const isValid = await zkGen.verifyProof(proof);
console.log('Proof valid:', isValid);
```

### **formatProofForSolidity()**
```typescript
formatProofForSolidity(proof: any): SolidityProof
```

**Parameters:**
- `proof`: Raw snarkjs proof object

**Returns:** Formatted proof for Solidity contract calls

**Example:**
```typescript
const solidityProof = zkGen.formatProofForSolidity(rawProof);
await contract.verifyProof(
    solidityProof.a,
    solidityProof.b,
    solidityProof.c,
    publicSignals
);
```

---

## 🌐 **AvaxCPoE**

### **Constructor**
```typescript
new AvaxCPoE(rpcUrl: string, sourceSubnet?: string)
```

**Parameters:**
- `rpcUrl`: Avalanche RPC endpoint URL
- `sourceSubnet` (optional): Source subnet identifier (default: 'avalanche-fuji')

**Example:**
```typescript
// Fuji testnet
const avaxCPoE = new AvaxCPoE('https://api.avax-test.network/ext/bc/C/rpc');

// Custom subnet
const customCPoE = new AvaxCPoE(
    'https://my-subnet-rpc.avax.network',
    'my-custom-subnet'
);
```

### **generateProof()**
```typescript
async generateProof(
    transactionHash: string,
    options?: ProofGenerationOptions
): Promise<Proof>
```

**Parameters:**
- `transactionHash`: Transaction hash to generate proof for
- `options`: Optional configuration

**Returns:** Cross-subnet proof object

**Example:**
```typescript
const proof = await avaxCPoE.generateProof(
    '0x1234567890abcdef...',
    { logIndex: 0, blockConfirmations: 6 }
);
```

### **verifyProof()**
```typescript
async verifyProof(
    proof: Proof,
    targetSubnet: string
): Promise<VerificationResult>
```

**Parameters:**
- `proof`: Cross-subnet proof to verify
- `targetSubnet`: Target subnet identifier

**Returns:** Verification result with validity status

**Example:**
```typescript
const result = await avaxCPoE.verifyProof(proof, 'target-subnet');
console.log('Cross-subnet proof valid:', result.valid);
```

### **extractEventData()**
```typescript
async extractEventData(
    transactionHash: string,
    eventSignature: string
): Promise<EventData>
```

**Parameters:**
- `transactionHash`: Transaction containing the event
- `eventSignature`: Event signature to extract

**Returns:** Decoded event data

**Example:**
```typescript
const eventData = await avaxCPoE.extractEventData(
    txHash,
    'Stake(address,uint256)'
);
```

---

## 🛠️ **CryptoUtils**

### **generateMerkleProof()**
```typescript
static generateMerkleProof(
    leaves: string[],
    targetIndex: number
): MerkleProof
```

**Parameters:**
- `leaves`: Array of leaf values
- `targetIndex`: Index of target leaf

**Returns:** Merkle inclusion proof

**Example:**
```typescript
const merkleProof = CryptoUtils.generateMerkleProof(
    ['0x123...', '0x456...', '0x789...'],
    1
);
```

### **verifyMerkleProof()**
```typescript
static verifyMerkleProof(
    proof: string[],
    root: string,
    leaf: string
): boolean
```

**Parameters:**
- `proof`: Merkle proof path
- `root`: Merkle root
- `leaf`: Leaf value to verify

**Returns:** `true` if leaf is included in tree

**Example:**
```typescript
const isIncluded = CryptoUtils.verifyMerkleProof(
    merkleProof.proof,
    merkleProof.root,
    leafValue
);
```

### **generateNullifier()**
```typescript
static generateNullifier(
    secret: string,
    amount: string
): string
```

**Parameters:**
- `secret`: User's private secret
- `amount`: Amount to commit to

**Returns:** Nullifier hash

**Example:**
```typescript
const nullifier = CryptoUtils.generateNullifier(
    userSecret,
    stakeAmount
);
```

### **signBlockData()**
```typescript
static async signBlockData(
    blockData: BlockData,
    privateKey?: string
): Promise<string>
```

**Parameters:**
- `blockData`: Block information to sign
- `privateKey` (optional): Signing key

**Returns:** Cryptographic signature

**Example:**
```typescript
const signature = await CryptoUtils.signBlockData({
    blockHash: block.hash,
    blockNumber: block.number,
    merkleRoot: merkleProof.root,
    timestamp: block.timestamp
});
```

---

## 📝 **Type Definitions**

### **PrivateInputs**
```typescript
interface PrivateInputs {
    actualAmount: string;              // Real amount (wei format)
    userSecret: string;                // Private nullifier seed
    merklePathElements?: string[];     // Merkle proof path
    merklePathIndices?: number[];      // Merkle proof indices
}
```

### **PublicInputs**
```typescript
interface PublicInputs {
    minAmount: string;                 // Minimum threshold (wei format)
    merkleRoot?: string;               // Merkle tree root
    nullifierHash?: string;            // Nullifier commitment
}
```

### **ZKProof**
```typescript
interface ZKProof {
    proof: {
        a: [string, string];           // G1 point A
        b: [[string, string], [string, string]]; // G2 point B
        c: [string, string];           // G1 point C
    };
    publicSignals: string[];           // Public outputs
    generationTime: number;            // Generation time in ms
    proofSize: number;                 // Proof size in bytes
    valid: boolean;                    // Validity flag
}
```

### **Proof (Cross-Subnet)**
```typescript
interface Proof {
    transactionHash: string;           // Original transaction hash
    blockProof: {
        hash: string;                  // Block hash
        number: number;                // Block number
        merkleRoot: string;            // Block's merkle root
    };
    inclusionProof: string[];          // Merkle inclusion proof
    signature: string;                 // Cryptographic signature
    sourceSubnet: string;              // Source subnet identifier
}
```

### **VerificationResult**
```typescript
interface VerificationResult {
    valid: boolean;                    // Verification success
    sourceSubnet: string;              // Source subnet
    targetSubnet: string;              // Target subnet
    verificationTime: number;          // Verification time in ms
    errorMessage?: string;             // Error details if invalid
}
```

### **ProofGenerationOptions**
```typescript
interface ProofGenerationOptions {
    logIndex?: number;                 // Event log index (default: 0)
    blockConfirmations?: number;       // Required confirmations (default: 6)
    includeReceipt?: boolean;          // Include full receipt (default: false)
}
```

### **MerkleProof**
```typescript
interface MerkleProof {
    root: string;                      // Merkle tree root
    proof: string[];                   // Proof path
    indices: number[];                 // Path indices
    leaf: string;                      // Target leaf
}
```

### **EventData**
```typescript
interface EventData {
    address: string;                   // Contract address
    topics: string[];                  // Event topics
    data: string;                      // Event data
    decoded: any;                      // Decoded parameters
    blockNumber: number;               // Block number
    transactionHash: string;           // Transaction hash
}
```

---

## 🔧 **Configuration Options**

### **Environment Variables**
```bash
# Debug logging
CROSSLEND_DEBUG=true

# Custom circuit paths
CROSSLEND_CIRCUIT_PATH=./circuits/custom.circom
CROSSLEND_PROVING_KEY_PATH=./keys/custom.zkey

# RPC endpoints
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CUSTOM_SUBNET_RPC=https://my-subnet.avax.network

# Gas optimization
CROSSLEND_GAS_LIMIT=500000
CROSSLEND_GAS_PRICE=25000000000
```

### **SDK Configuration**
```typescript
// Global configuration
import { configure } from '@crosslend/avax-cpoe-sdk';

configure({
    defaultRpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    defaultGasLimit: 500000,
    debugMode: true,
    circuitPath: './circuits/stake_proof.circom',
    provingKeyPath: './keys/stake_proof.zkey'
});
```

---

## ⚡ **Performance Optimization**

### **Batch Operations**
```typescript
// Batch proof generation
const proofs = await Promise.all([
    zkGen.generateProductionProof(inputs1),
    zkGen.generateProductionProof(inputs2),
    zkGen.generateProductionProof(inputs3)
]);

// Batch verification
const results = await Promise.all([
    zkGen.verifyProof(proof1),
    zkGen.verifyProof(proof2),
    zkGen.verifyProof(proof3)
]);
```

### **Caching**
```typescript
// Cache proving keys for faster generation
const zkGen = new ProductionZKProofGenerator();
await zkGen.preloadKeys(); // Load keys into memory

// Cache Merkle proofs
const merkleCache = new Map();
const cachedProof = merkleCache.get(leafHash) || 
    CryptoUtils.generateMerkleProof(leaves, index);
```

### **Memory Management**
```typescript
// Clean up resources
zkGen.dispose(); // Free circuit memory
avaxCPoE.disconnect(); // Close RPC connections
```

---

## 🚨 **Error Handling**

### **Common Errors**
```typescript
try {
    const proof = await zkGen.generateProductionProof(inputs);
} catch (error) {
    if (error.code === 'CONSTRAINT_VIOLATION') {
        console.error('actualAmount < minAmount');
    } else if (error.code === 'INVALID_MERKLE_PROOF') {
        console.error('Merkle proof verification failed');
    } else if (error.code === 'NULLIFIER_ALREADY_USED') {
        console.error('Nullifier has been used before');
    }
}
```

### **Error Codes**
- `CONSTRAINT_VIOLATION`: Mathematical constraint not satisfied
- `INVALID_MERKLE_PROOF`: Merkle inclusion proof invalid
- `NULLIFIER_ALREADY_USED`: Nullifier reuse detected
- `CIRCUIT_NOT_FOUND`: Circuit file not found
- `PROVING_KEY_INVALID`: Proving key corrupted or invalid
- `RPC_CONNECTION_FAILED`: Cannot connect to Avalanche RPC
- `TRANSACTION_NOT_FOUND`: Transaction hash not found
- `INSUFFICIENT_CONFIRMATIONS`: Not enough block confirmations

---

## 🧪 **Testing Utilities**

### **Mock Data Generation**
```typescript
import { TestUtils } from '@crosslend/avax-cpoe-sdk/testing';

// Generate test data
const testInputs = TestUtils.generateTestInputs({
    actualAmount: '5000000000000000000',
    minAmount: '1000000000000000000'
});

// Mock transaction
const mockTx = TestUtils.createMockTransaction({
    value: ethers.utils.parseEther('10'),
    to: contractAddress
});
```

### **Performance Testing**
```typescript
// Benchmark proof generation
const benchmark = await TestUtils.benchmarkProofGeneration(
    testInputs,
    1000 // iterations
);

console.log('Average generation time:', benchmark.averageTime);
console.log('Throughput:', benchmark.proofsPerSecond);
```

---

## 📊 **Monitoring & Analytics**

### **Performance Metrics**
```typescript
// Enable metrics collection
const zkGen = new ProductionZKProofGenerator({ 
    enableMetrics: true 
});

// Get performance stats
const stats = zkGen.getPerformanceStats();
console.log('Total proofs generated:', stats.totalProofs);
console.log('Average generation time:', stats.averageTime);
console.log('Success rate:', stats.successRate);
```

### **Event Logging**
```typescript
// Listen to SDK events
zkGen.on('proofGenerated', (proof) => {
    console.log('New proof generated:', proof.generationTime);
});

zkGen.on('proofVerified', (result) => {
    console.log('Proof verified:', result.valid);
});

avaxCPoE.on('crossSubnetProof', (proof) => {
    console.log('Cross-subnet proof created:', proof.sourceSubnet);
});
```

---

This API reference provides complete documentation for all SDK functionality. Use it alongside the Developer Guide for comprehensive integration support.
