# 🏔️ Crosslend Protocol

**Cross-Domain Proof-of-Event (CPoE) DeFi Protocol for Avalanche**

A revolutionary DeFi protocol that enables secure cross-chain lending and borrowing using cryptographic proof-of-events on the Avalanche network.

## 🚀 Project Structure

```
Crosslend-protocol/
├── contracts/          # Smart contracts (Hardhat)
├── sdk/                # AVAX-CPoE SDK (TypeScript)
├── frontend/           # React frontend (TypeScript)
└── README.md          # This file
```

## 📦 Components

### 1. Smart Contracts (`/contracts`)
- **Framework**: Hardhat v2.26.2
- **Language**: Solidity
- **Network**: Avalanche (Fuji Testnet)
- **Dependencies**: ethers v6.4.0, @nomicfoundation/hardhat-toolbox

**Setup:**
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

### 2. AVAX-CPoE SDK (`/sdk`)
- **Language**: TypeScript
- **Purpose**: Cross-Domain Proof-of-Event generation and verification
- **Features**: Merkle proofs, block signatures, event verification

**Key Features:**
- 🔐 **Cryptographic Proofs**: Generate tamper-proof event proofs
- 🌳 **Merkle Trees**: Efficient event inclusion proofs
- ✍️ **Digital Signatures**: Block validation with validator signatures
- 🔍 **Verification**: Complete proof verification pipeline

**Setup:**
```bash
cd sdk
npm install
npm run build
npm run test
```

**Usage:**
```typescript
import { AvaxCPoE } from '@crosslend/avax-cpoe-sdk';

const cpoe = new AvaxCPoE('https://api.avax-test.network/ext/bc/C/rpc');

// Generate proof for a transaction
const proof = await cpoe.generateProof('0x1234...txhash');

// Verify proof
const result = await cpoe.verifyProof(proof);
console.log('Proof valid:', result.isValid);
```

### 3. Frontend (`/frontend`)
- **Framework**: React 18 with TypeScript
- **Purpose**: User interface for lending/borrowing
- **Features**: Web3 integration, proof visualization

**Setup:**
```bash
cd frontend
npm install
npm start
```

## 🔧 Development Setup

### Prerequisites
- Node.js v18+ (v23.6.0 currently used, but v18-v20 recommended for Hardhat)
- npm or yarn
- Git

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd Crosslend-protocol

# Setup contracts
cd contracts && npm install && cd ..

# Setup SDK
cd sdk && npm install && npm run build && cd ..

# Setup frontend
cd frontend && npm install && cd ..
```

## 🧪 Testing

### SDK Tests
```bash
cd sdk
npm run test
```

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

## 🌟 Key Innovations

### Cross-Domain Proof-of-Event (CPoE)
Our proprietary CPoE technology enables:

1. **Event Verification**: Cryptographically prove that events occurred on-chain
2. **Cross-Chain Security**: Maintain security across different blockchain networks
3. **Efficient Proofs**: Minimal data requirements for maximum security
4. **Validator Consensus**: Leverage Avalanche's validator network for proof authenticity

### DeFi Integration
- **Collateral Verification**: Prove asset ownership across chains
- **Liquidation Events**: Secure cross-chain liquidation triggers
- **Interest Calculations**: Verifiable interest accrual proofs
- **Governance**: Cross-chain voting and proposal verification

## 🔒 Security Features

- ✅ **Merkle Tree Proofs**: Mathematical proof of event inclusion
- ✅ **Block Signatures**: Validator-signed block authenticity
- ✅ **Event Integrity**: Tamper-proof event data verification
- ✅ **Replay Protection**: Timestamp-based proof freshness
- ✅ **Version Control**: Backward-compatible proof formats

## 🚧 Development Status

- ✅ **SDK Core**: Complete with proof generation and verification
- ✅ **Smart Contracts**: Hardhat setup complete
- 🔄 **Frontend**: React app in progress
- ⏳ **Integration**: Cross-component integration pending
- ⏳ **Testing**: Comprehensive test suite in development

## 📚 Documentation

### API Reference
- [SDK Documentation](./sdk/README.md)
- [Smart Contract Documentation](./contracts/README.md)
- [Frontend Documentation](./frontend/README.md)

### Tutorials
- Getting Started with CPoE
- Building Cross-Chain DApps
- Advanced Proof Verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🔗 Links

- **Avalanche Network**: https://avax.network
- **Hardhat**: https://hardhat.org
- **React**: https://reactjs.org

---

**Built with ❤️ for the Avalanche ecosystem**
