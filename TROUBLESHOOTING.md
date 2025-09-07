# 🔧 Vault SDK Troubleshooting Guide
## Quick Solutions for Common Issues

---

## 🚨 **Common Issues & Solutions**

### **1. Proof Generation Fails**

#### **Error: "Constraint violation: insufficient amount"**
```typescript
// ❌ Problem: actualAmount < minAmount
const proof = await zkGen.generateProductionProof({
    actualAmount: "500000000000000000",  // 0.5 AVAX
    minAmount: "1000000000000000000"     // 1 AVAX - HIGHER than actual!
});

// ✅ Solution: Ensure actualAmount >= minAmount
const proof = await zkGen.generateProductionProof({
    actualAmount: "2000000000000000000",  // 2 AVAX
    minAmount: "1000000000000000000"      // 1 AVAX - OK!
});
```

#### **Error: "Circuit not found"**
```bash
# ❌ Problem: Missing circuit files
Error: ENOENT: no such file or directory, open './circuits/stake_proof.circom'

# ✅ Solution: Check circuit file exists
ls circuits/stake_proof.circom

# If missing, ensure you have the complete SDK:
git clone https://github.com/vijaygopalbalasa/Avax-CPoE.git
cd Avax-CPoE/circuits
ls -la
```

#### **Error: "Proving key invalid"**
```typescript
// ❌ Problem: Corrupted or missing proving key
Error: Invalid proving key format

// ✅ Solution: Regenerate proving key
const zkGen = new ProductionZKProofGenerator();
await zkGen.generateProvingKey('./circuits/stake_proof.circom');
```

### **2. Smart Contract Verification Fails**

#### **Error: "Invalid ZK proof"**
```solidity
// ❌ Problem: Proof format mismatch
function verifyProof(uint[2] memory _pA, ...) {
    // Wrong proof format passed to contract
}

// ✅ Solution: Use formatProofForSolidity()
const solidityProof = zkGen.formatProofForSolidity(proof.proof);
await contract.verifyProof(
    solidityProof.a,
    solidityProof.b,
    solidityProof.c,
    proof.publicSignals
);
```

#### **Error: "Nullifier already used"**
```typescript
// ❌ Problem: Reusing same nullifier
const proof1 = await zkGen.generateProductionProof({
    actualAmount: "5000000000000000000",
    userSecret: "same-secret",  // Same secret = same nullifier!
    minAmount: "1000000000000000000"
});

// ✅ Solution: Use unique secrets or add nonce
const proof2 = await zkGen.generateProductionProof({
    actualAmount: "5000000000000000000",
    userSecret: "same-secret-" + Date.now(), // Unique!
    minAmount: "1000000000000000000"
});
```

### **3. Cross-Subnet Issues**

#### **Error: "Transaction not found"**
```typescript
// ❌ Problem: Wrong RPC or transaction hash
const proof = await avaxCPoE.generateProof('0xinvalidhash...');

// ✅ Solution: Verify transaction exists
const tx = await provider.getTransaction(transactionHash);
if (!tx) {
    console.error('Transaction not found on this network');
}

// Check you're on the right network
const network = await provider.getNetwork();
console.log('Current network:', network.name);
```

#### **Error: "Insufficient block confirmations"**
```typescript
// ❌ Problem: Transaction too recent
const proof = await avaxCPoE.generateProof(recentTxHash);

// ✅ Solution: Wait for confirmations
const receipt = await provider.getTransactionReceipt(txHash);
const currentBlock = await provider.getBlockNumber();
const confirmations = currentBlock - receipt.blockNumber;

if (confirmations < 6) {
    console.log(`Waiting for confirmations: ${confirmations}/6`);
    // Wait and retry
}
```

---

## 🔍 **Debugging Steps**

### **Step 1: Enable Debug Mode**
```typescript
// Enable detailed logging
process.env.CROSSLEND_DEBUG = 'true';

const zkGen = new ProductionZKProofGenerator({ debug: true });
const avaxCPoE = new AvaxCPoE(rpcUrl, { debug: true });
```

### **Step 2: Validate Inputs**
```typescript
function validateInputs(privateInputs: PrivateInputs, publicInputs: PublicInputs) {
    console.log('🔍 Validating inputs...');
    
    // Check amount format
    if (!ethers.utils.isHexString(privateInputs.actualAmount)) {
        console.error('❌ actualAmount must be hex string');
        return false;
    }
    
    // Check amount constraint
    const actual = BigInt(privateInputs.actualAmount);
    const minimum = BigInt(publicInputs.minAmount);
    
    if (actual < minimum) {
        console.error(`❌ Constraint violation: ${actual} < ${minimum}`);
        return false;
    }
    
    // Check secret length
    if (privateInputs.userSecret.length < 10) {
        console.error('❌ userSecret too short (minimum 10 characters)');
        return false;
    }
    
    console.log('✅ All inputs valid');
    return true;
}
```

### **Step 3: Test Components Individually**
```typescript
// Test ZK proof generation
async function testZKProof() {
    try {
        console.log('🧪 Testing ZK proof generation...');
        
        const proof = await zkGen.generateProductionProof({
            actualAmount: "5000000000000000000",
            userSecret: "test-secret-" + Date.now(),
            minAmount: "1000000000000000000"
        });
        
        console.log('✅ Proof generated:', proof.generationTime + 'ms');
        
        const verified = await zkGen.verifyProof(proof);
        console.log('✅ Proof verified:', verified);
        
        return proof;
    } catch (error) {
        console.error('❌ ZK proof test failed:', error.message);
        throw error;
    }
}

// Test cross-subnet communication
async function testCrossSubnet() {
    try {
        console.log('🧪 Testing cross-subnet communication...');
        
        // Use a known transaction hash
        const knownTxHash = '0x...'; // Replace with actual tx hash
        
        const proof = await avaxCPoE.generateProof(knownTxHash);
        console.log('✅ Cross-subnet proof generated');
        
        const verification = await avaxCPoE.verifyProof(proof, 'target-subnet');
        console.log('✅ Cross-subnet verification:', verification.valid);
        
        return proof;
    } catch (error) {
        console.error('❌ Cross-subnet test failed:', error.message);
        throw error;
    }
}
```

---

## 🌐 **Network Issues**

### **RPC Connection Problems**
```typescript
// ❌ Problem: RPC endpoint not responding
Error: Network Error - Could not connect to RPC

// ✅ Solution: Test RPC endpoints
const testRPCs = [
    'https://api.avax-test.network/ext/bc/C/rpc',
    'https://avalanche-fuji-c-chain.publicnode.com',
    'https://rpc.ankr.com/avalanche_fuji'
];

async function findWorkingRPC() {
    for (const rpc of testRPCs) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(rpc);
            const blockNumber = await provider.getBlockNumber();
            console.log(`✅ ${rpc} - Block: ${blockNumber}`);
            return rpc;
        } catch (error) {
            console.log(`❌ ${rpc} - Failed`);
        }
    }
    throw new Error('No working RPC found');
}
```

### **Gas Issues**
```typescript
// ❌ Problem: Out of gas
Error: Transaction reverted: out of gas

// ✅ Solution: Estimate and set proper gas
const gasEstimate = await contract.estimateGas.verifyProof(...args);
const gasLimit = gasEstimate.mul(120).div(100); // 20% buffer

const tx = await contract.verifyProof(...args, {
    gasLimit: gasLimit,
    gasPrice: ethers.utils.parseUnits('25', 'gwei')
});
```

---

## 📱 **Frontend Issues**

### **MetaMask Connection**
```typescript
// ❌ Problem: MetaMask not connecting
Error: User rejected the request

// ✅ Solution: Proper MetaMask handling
async function connectMetaMask() {
    if (!window.ethereum) {
        throw new Error('MetaMask not installed');
    }
    
    try {
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        // Switch to Avalanche Fuji
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xA869' }] // Fuji testnet
        });
        
        return accounts[0];
    } catch (error) {
        if (error.code === 4902) {
            // Add Avalanche Fuji network
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0xA869',
                    chainName: 'Avalanche Fuji Testnet',
                    nativeCurrency: {
                        name: 'AVAX',
                        symbol: 'AVAX',
                        decimals: 18
                    },
                    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                    blockExplorerUrls: ['https://testnet.snowtrace.io/']
                }]
            });
        }
        throw error;
    }
}
```

### **React Integration Issues**
```typescript
// ❌ Problem: SDK not working in React
Error: Cannot resolve module '@crosslend/avax-cpoe-sdk'

// ✅ Solution: Proper React setup
// 1. Install dependencies
npm install @crosslend/avax-cpoe-sdk ethers

// 2. Create React hook
import { useState, useEffect } from 'react';
import { ProductionZKProofGenerator } from '@crosslend/avax-cpoe-sdk';

export function useZKProof() {
    const [zkGen, setZkGen] = useState<ProductionZKProofGenerator | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const generator = new ProductionZKProofGenerator();
        setZkGen(generator);
        
        return () => {
            generator.dispose(); // Clean up
        };
    }, []);
    
    const generateProof = async (inputs: PrivateInputs) => {
        if (!zkGen) throw new Error('ZK generator not initialized');
        
        setLoading(true);
        try {
            const proof = await zkGen.generateProductionProof(inputs);
            return proof;
        } finally {
            setLoading(false);
        }
    };
    
    return { generateProof, loading };
}
```

---

## 🔧 **Performance Issues**

### **Slow Proof Generation**
```typescript
// ❌ Problem: Proof taking too long (>1 second)
const startTime = Date.now();
const proof = await zkGen.generateProductionProof(inputs);
const duration = Date.now() - startTime;
console.log('Proof generation took:', duration + 'ms'); // Should be ~15ms

// ✅ Solution: Optimize and cache
class OptimizedZKGenerator {
    private static instance: ProductionZKProofGenerator;
    
    static async getInstance() {
        if (!this.instance) {
            this.instance = new ProductionZKProofGenerator();
            await this.instance.preloadKeys(); // Cache keys in memory
        }
        return this.instance;
    }
}

// Use singleton for better performance
const zkGen = await OptimizedZKGenerator.getInstance();
```

### **Memory Issues**
```typescript
// ❌ Problem: Memory usage growing over time
Error: JavaScript heap out of memory

// ✅ Solution: Proper cleanup
class ManagedZKGenerator {
    private zkGen: ProductionZKProofGenerator;
    private proofCount = 0;
    
    async generateProof(inputs: PrivateInputs) {
        const proof = await this.zkGen.generateProductionProof(inputs);
        
        this.proofCount++;
        
        // Clean up every 100 proofs
        if (this.proofCount % 100 === 0) {
            await this.cleanup();
        }
        
        return proof;
    }
    
    private async cleanup() {
        this.zkGen.dispose();
        this.zkGen = new ProductionZKProofGenerator();
        await this.zkGen.preloadKeys();
    }
}
```

---

## 📊 **Monitoring & Diagnostics**

### **Health Check Function**
```typescript
async function healthCheck() {
    const results = {
        zkProofGeneration: false,
        crossSubnetCommunication: false,
        smartContractConnection: false,
        rpcConnection: false
    };
    
    try {
        // Test ZK proof generation
        const zkGen = new ProductionZKProofGenerator();
        const testProof = await zkGen.generateProductionProof({
            actualAmount: "2000000000000000000",
            userSecret: "health-check-" + Date.now(),
            minAmount: "1000000000000000000"
        });
        results.zkProofGeneration = await zkGen.verifyProof(testProof);
        
        // Test RPC connection
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const blockNumber = await provider.getBlockNumber();
        results.rpcConnection = blockNumber > 0;
        
        // Test cross-subnet
        const avaxCPoE = new AvaxCPoE(RPC_URL);
        // Use a known transaction hash for testing
        results.crossSubnetCommunication = true; // Simplified for example
        
        // Test smart contract
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const contractCall = await contract.getStats();
        results.smartContractConnection = true;
        
    } catch (error) {
        console.error('Health check failed:', error);
    }
    
    return results;
}

// Run health check
healthCheck().then(results => {
    console.log('🏥 Health Check Results:', results);
});
```

### **Performance Monitoring**
```typescript
class PerformanceMonitor {
    private metrics = {
        proofGenerationTimes: [] as number[],
        verificationTimes: [] as number[],
        errorCount: 0,
        successCount: 0
    };
    
    async monitorProofGeneration(inputs: PrivateInputs) {
        const startTime = Date.now();
        
        try {
            const proof = await zkGen.generateProductionProof(inputs);
            const duration = Date.now() - startTime;
            
            this.metrics.proofGenerationTimes.push(duration);
            this.metrics.successCount++;
            
            if (duration > 100) { // Alert if > 100ms
                console.warn(`⚠️ Slow proof generation: ${duration}ms`);
            }
            
            return proof;
        } catch (error) {
            this.metrics.errorCount++;
            console.error('❌ Proof generation failed:', error);
            throw error;
        }
    }
    
    getStats() {
        const avgTime = this.metrics.proofGenerationTimes.reduce((a, b) => a + b, 0) / 
                       this.metrics.proofGenerationTimes.length;
        
        return {
            averageProofTime: avgTime,
            successRate: this.metrics.successCount / 
                        (this.metrics.successCount + this.metrics.errorCount),
            totalProofs: this.metrics.successCount,
            totalErrors: this.metrics.errorCount
        };
    }
}
```

---

## 🆘 **Getting Help**

### **Before Asking for Help**
1. ✅ Check this troubleshooting guide
2. ✅ Enable debug mode and check logs
3. ✅ Test with minimal example
4. ✅ Verify network connectivity
5. ✅ Check SDK version compatibility

### **How to Report Issues**
```typescript
// Include this information when reporting bugs:
const diagnosticInfo = {
    sdkVersion: require('@crosslend/avax-cpoe-sdk/package.json').version,
    nodeVersion: process.version,
    platform: process.platform,
    networkId: await provider.getNetwork().then(n => n.chainId),
    blockNumber: await provider.getBlockNumber(),
    errorMessage: error.message,
    stackTrace: error.stack,
    // DO NOT include: private keys, user secrets, actual amounts
};

console.log('🐛 Bug Report Info:', diagnosticInfo);
```

### **Community Support**
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/vijaygopalbalasa/Avax-CPoE/issues)
- **Discord**: Join our developer community
- **Documentation**: Check the complete SDK documentation
- **Examples**: Browse working code examples

---

**Remember: Most issues are resolved by checking input validation, network connectivity, and ensuring you're using the latest SDK version.** 🔧✨
