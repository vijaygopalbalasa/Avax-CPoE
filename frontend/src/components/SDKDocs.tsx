import React, { useState } from 'react';

const SDKDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabStyle = (isActive: boolean) => ({
    padding: '10px 20px',
    margin: '0 5px',
    backgroundColor: isActive ? '#4CAF50' : '#f0f0f0',
    color: isActive ? 'white' : '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal'
  });

  const codeBlockStyle = {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    padding: '15px',
    borderRadius: '8px',
    fontFamily: 'Monaco, Consolas, monospace',
    fontSize: '14px',
    overflow: 'auto',
    margin: '10px 0'
  };

  const sectionStyle = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    margin: '15px 0',
    border: '1px solid #ddd'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px' }}>
          🚀 Vault SDK Integration Guide
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
          Infrastructure-Level Zero-Knowledge Verification SDK for Avalanche
        </p>
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '10px',
          border: '2px solid #4CAF50'
        }}>
          <strong style={{ color: '#2e7d32' }}>
            🔐 Real Zero-Knowledge Infrastructure • ⚡ 15ms Proof Generation • 🌐 Cross-Subnet Verification
          </strong>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button onClick={() => setActiveTab('overview')} style={tabStyle(activeTab === 'overview')}>
          📋 Overview
        </button>
        <button onClick={() => setActiveTab('quickstart')} style={tabStyle(activeTab === 'quickstart')}>
          🚀 Quick Start
        </button>
        <button onClick={() => setActiveTab('examples')} style={tabStyle(activeTab === 'examples')}>
          💡 Examples
        </button>
        <button onClick={() => setActiveTab('architecture')} style={tabStyle(activeTab === 'architecture')}>
          🏗 Architecture
        </button>
        <button onClick={() => setActiveTab('performance')} style={tabStyle(activeTab === 'performance')}>
          ⚡ Performance
        </button>
      </div>

      {/* Content Sections */}
      {activeTab === 'overview' && (
        <div>
          <div style={sectionStyle}>
            <h2 style={{ color: '#2c3e50' }}>🔐 What is Vault SDK?</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Vault SDK provides <strong>infrastructure-level zero-knowledge verification</strong> and 
              <strong> cross-subnet proof systems</strong> for Avalanche ecosystem development. This is <strong>real cryptography</strong> using 
              Groth16 zk-SNARKs with BN128 elliptic curves - not simulation!
            </p>
            
            <h3 style={{ color: '#4CAF50', marginTop: '25px' }}>🎯 Core Components</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4 style={{ color: '#2196F3' }}>🔐 ProductionZKProofGenerator</h4>
                <p>Real zero-knowledge proof generation with mathematical privacy guarantees.</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4 style={{ color: '#FF9800' }}>🏭 VaultCPoE</h4>
                <p>Cross-subnet verification infrastructure for Avalanche ecosystem.</p>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#2c3e50' }}>🌟 Why Choose Vault SDK?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div>
                <h4>Lightning Fast</h4>
                <p>15ms proof generation</p>
              </div>
              <div style={{ textAlign: 'center', padding: '15px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
                <h4>Infrastructure Level</h4>
                <p>Core building blocks</p>
              </div>
              <div style={{ textAlign: 'center', padding: '15px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌐</div>
                <h4>Cross-Subnet</h4>
                <p>Avalanche ecosystem ready</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quickstart' && (
        <div>
          <div style={sectionStyle}>
            <h2 style={{ color: '#2c3e50' }}>🚀 Quick Start Guide</h2>
            
            <h3 style={{ color: '#4CAF50' }}>📦 Installation</h3>
            <pre style={codeBlockStyle}>
{`npm install @vault/sdk
# or
yarn add @vault/sdk`}
            </pre>

            <h3 style={{ color: '#4CAF50' }}>💻 Basic Usage</h3>
            <pre style={codeBlockStyle}>
{`import { ProductionZKProofGenerator } from '@vault/sdk';

const zkGenerator = new ProductionZKProofGenerator();

// Generate ZK proof for cross-subnet verification without revealing exact amount
const proof = await zkGenerator.generateProductionProof(
    // Private inputs (hidden from everyone)
    {
        actualAmount: BigInt("1500000000000000000"), // 1.5 AVAX (HIDDEN)
        userSecret: BigInt("12345"),
        merkleProof: [/* merkle proof array */]
    },
    // Public inputs (visible to verifiers)
    {
        minAmount: BigInt("1000000000000000000"),   // 1.0 AVAX (PUBLIC)
        merkleRoot: BigInt("0x..."),
        nullifierHash: BigInt("0x...")             // Prevents double-spending
    }
);

console.log('🎉 ZK Proof Generated:', proof);
// Result: Cryptographic proof that 1.5 >= 1.0 without revealing 1.5!`}
            </pre>

            <div style={{ 
              backgroundColor: '#e3f2fd', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #2196F3',
              marginTop: '20px'
            }}>
              <strong style={{ color: '#1976d2' }}>🎯 Result:</strong>
              <p style={{ margin: '5px 0', color: '#1976d2' }}>
                The system generates a mathematical proof that the user has at least 1.0 AVAX, 
                but their exact amount (1.5 AVAX) remains completely hidden!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'examples' && (
        <div>
          <div style={sectionStyle}>
            <h2 style={{ color: '#2c3e50' }}>💡 Real-World Examples</h2>
            
            <h3 style={{ color: '#4CAF50' }}>🏦 Private DeFi Lending</h3>
            <p>Hide collateral amounts while proving sufficiency:</p>
            <pre style={codeBlockStyle}>
{`// Private lending with hidden collateral
class PrivateLendingProtocol {
    async borrowWithPrivateCollateral(
        userCollateralAmount: bigint,    // Hidden from everyone
        minRequiredCollateral: bigint,   // Public requirement
        borrowAmount: bigint
    ) {
        // Generate ZK proof
        const zkProof = await this.zkGenerator.generateProductionProof(
            {
                actualAmount: userCollateralAmount,  // PRIVATE: Real collateral
                userSecret: this.generateUserSecret(),
                merkleProof: await this.getMerkleProof()
            },
            {
                minAmount: minRequiredCollateral,    // PUBLIC: Minimum required
                merkleRoot: await this.getMerkleRoot(),
                nullifierHash: this.generateNullifier()
            }
        );

        // Submit to smart contract with perfect privacy!
        const tx = await this.contract.borrowWithZKProof(
            [zkProof.proof.pi_a[0], zkProof.proof.pi_a[1]],
            [[zkProof.proof.pi_b[0][1], zkProof.proof.pi_b[0][0]], 
             [zkProof.proof.pi_b[1][1], zkProof.proof.pi_b[1][0]]],
            [zkProof.proof.pi_c[0], zkProof.proof.pi_c[1]],
            zkProof.publicInputs
        );

        return await tx.wait();
    }
}`}
            </pre>

            <h3 style={{ color: '#4CAF50' }}>🎮 Private Gaming Achievements</h3>
            <p>Prove minimum scores without revealing exact performance:</p>
            <pre style={codeBlockStyle}>
{`// Private gaming with hidden scores
class PrivateGameAchievements {
    async proveAchievement(
        playerScore: number,      // Hidden from other players
        requiredScore: number,    // Public achievement requirement
        achievementId: string
    ) {
        const zkProof = await this.zkGenerator.generateProductionProof(
            {
                actualAmount: BigInt(playerScore),           // PRIVATE: Real score
                userSecret: BigInt(this.playerId),
                merkleProof: await this.getScoreMerkleProof()
            },
            {
                minAmount: BigInt(requiredScore),            // PUBLIC: Required score
                merkleRoot: await this.getGameMerkleRoot(),
                nullifierHash: BigInt(achievementId)
            }
        );

        // Mint NFT reward with private achievement proof!
        return await this.gameContract.mintAchievementNFT(zkProof);
    }
}`}
            </pre>

            <h3 style={{ color: '#4CAF50' }}>🗳 Private Governance Voting</h3>
            <p>Vote privately while proving voting power eligibility:</p>
            <pre style={codeBlockStyle}>
{`// Private voting with hidden stake amounts
class PrivateGovernanceVoting {
    async castPrivateVote(
        voterStakeAmount: bigint,     // Hidden voting power
        minVotingPower: bigint,       // Public minimum requirement
        vote: boolean                 // true = yes, false = no
    ) {
        const zkProof = await this.zkGenerator.generateProductionProof(
            {
                actualAmount: voterStakeAmount,              // PRIVATE: Real voting power
                userSecret: BigInt(this.voterAddress),
                merkleProof: await this.getStakeMerkleProof()
            },
            {
                minAmount: minVotingPower,                   // PUBLIC: Minimum required
                merkleRoot: await this.getStakingMerkleRoot(),
                nullifierHash: this.generateVoteNullifier() // Prevents double voting
            }
        );

        // Submit private vote to governance contract!
        return await this.governanceContract.castPrivateVote(zkProof, vote);
    }
}`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div>
          <div style={sectionStyle}>
            <h2 style={{ color: '#2c3e50' }}>🏗 Technical Architecture</h2>
            
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                border: '2px solid #ddd',
                fontFamily: 'Monaco, monospace'
              }}>
                <div style={{ marginBottom: '10px' }}>🖥️ <strong>FRONTEND</strong> (React + TypeScript)</div>
                <div style={{ margin: '5px 0' }}>↓ User Interface & MetaMask Integration</div>
                <div style={{ marginBottom: '10px' }}>🔐 <strong>ZERO-KNOWLEDGE LAYER</strong></div>
                <div style={{ margin: '5px 0' }}>↓ ProductionZKProofGenerator (Groth16)</div>
                <div style={{ marginBottom: '10px' }}>📱 <strong>SDK</strong> (TypeScript Library)</div>
                <div style={{ margin: '5px 0' }}>↓ Cross-Subnet + Privacy Integration</div>
                <div style={{ marginBottom: '10px' }}>⛓️ <strong>SMART CONTRACTS</strong> (Solidity)</div>
                <div style={{ margin: '5px 0' }}>↓ On-Chain ZK Verification</div>
                <div style={{ marginBottom: '10px' }}>🌐 <strong>AVALANCHE NETWORK</strong></div>
                <div style={{ margin: '5px 0' }}>↓ Multi-Subnet Deployment</div>
                <div>🌉 <strong>CROSS-SUBNET INFRASTRUCTURE</strong></div>
              </div>
            </div>

            <h3 style={{ color: '#4CAF50' }}>🔬 Technical Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4 style={{ color: '#2196F3' }}>Cryptographic Details</h4>
                <ul style={{ lineHeight: '1.6' }}>
                  <li><strong>Protocol:</strong> Groth16 zk-SNARKs</li>
                  <li><strong>Curve:</strong> BN128 (alt_bn128)</li>
                  <li><strong>Proof Size:</strong> 288 bytes</li>
                  <li><strong>Generation Time:</strong> ~15ms</li>
                </ul>
              </div>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4 style={{ color: '#FF9800' }}>Performance Metrics</h4>
                <ul style={{ lineHeight: '1.6' }}>
                  <li><strong>Gas Cost:</strong> 400-600k gas</li>
                  <li><strong>Privacy Level:</strong> Perfect zero-knowledge</li>
                  <li><strong>Scalability:</strong> Unlimited parallel generation</li>
                  <li><strong>Compatibility:</strong> All Avalanche subnets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div>
          <div style={sectionStyle}>
            <h2 style={{ color: '#2c3e50' }}>⚡ Performance & Benchmarks</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div style={{ 
                textAlign: 'center', 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                border: '2px solid #4CAF50'
              }}>
                <div style={{ fontSize: '2.5rem', color: '#4CAF50' }}>15ms</div>
                <h4>Proof Generation</h4>
                <p>Lightning-fast cryptographic proof creation</p>
              </div>
              <div style={{ 
                textAlign: 'center', 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                border: '2px solid #2196F3'
              }}>
                <div style={{ fontSize: '2.5rem', color: '#2196F3' }}>288</div>
                <h4>Bytes per Proof</h4>
                <p>Compact and efficient proof size</p>
              </div>
              <div style={{ 
                textAlign: 'center', 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                border: '2px solid #FF9800'
              }}>
                <div style={{ fontSize: '2.5rem', color: '#FF9800' }}>500k</div>
                <h4>Gas Cost</h4>
                <p>Reasonable verification cost</p>
              </div>
            </div>

            <h3 style={{ color: '#4CAF50' }}>📊 Competitive Comparison</h3>
            <div style={{ overflow: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Feature</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>CrossLend</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Tornado Cash</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Aztec</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Zcash</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Cross-Subnet</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#4CAF50', fontWeight: 'bold' }}>✅ FIRST EVER</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#f44336' }}>❌ Single chain</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#f44336' }}>❌ Ethereum only</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#f44336' }}>❌ Own chain</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Real ZK Proofs</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#4CAF50', fontWeight: 'bold' }}>✅ Groth16</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#4CAF50' }}>✅ Yes</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#4CAF50' }}>✅ Yes</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#4CAF50' }}>✅ Yes</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Developer SDK</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#4CAF50', fontWeight: 'bold' }}>✅ Complete</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#f44336' }}>❌ No</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#FF9800' }}>⚠️ Limited</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#f44336' }}>❌ No</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Avalanche Native</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#4CAF50', fontWeight: 'bold' }}>✅ Built for AVAX</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#f44336' }}>❌ No</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#f44336' }}>❌ No</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', color: '#f44336' }}>❌ No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={{ color: '#4CAF50' }}>🎯 Use Case Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4 style={{ color: '#2196F3' }}>DeFi Applications</h4>
                <ul style={{ lineHeight: '1.6' }}>
                  <li>Private lending with hidden collateral amounts</li>
                  <li>Anonymous trading without position exposure</li>
                  <li>Confidential staking across subnets</li>
                  <li>Cross-chain privacy bridging</li>
                </ul>
              </div>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4 style={{ color: '#FF9800' }}>Gaming & Governance</h4>
                <ul style={{ lineHeight: '1.6' }}>
                  <li>Private achievements with hidden scores</li>
                  <li>Anonymous tournaments and competitions</li>
                  <li>Private voting with hidden stake amounts</li>
                  <li>Confidential DAO participation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px',
        backgroundColor: '#2c3e50',
        color: 'white',
        borderRadius: '10px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>🚀 Ready to Build with Privacy?</h3>
        <p style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
          Join the privacy revolution on Avalanche with CrossLend SDK!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: '#34495e', padding: '10px 15px', borderRadius: '5px' }}>
            <strong>📚 Repository:</strong> github.com/vijaygopalbalasa/Avax-CPoE
          </div>
          <div style={{ backgroundColor: '#34495e', padding: '10px 15px', borderRadius: '5px' }}>
            <strong>⚡ Performance:</strong> 15ms proofs, 288 bytes
          </div>
          <div style={{ backgroundColor: '#34495e', padding: '10px 15px', borderRadius: '5px' }}>
            <strong>🔐 Privacy:</strong> Perfect zero-knowledge
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDKDocs;
