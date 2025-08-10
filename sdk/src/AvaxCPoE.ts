import { ethers } from 'ethers';
import { Proof, ProofGenerationOptions, VerificationResult } from './types';
import { CryptoUtils } from './utils';

export class AvaxCPoE {
    private provider: ethers.providers.Provider;
    private sourceSubnet: string;

    constructor(rpcUrl: string, sourceSubnet: string = 'avalanche-fuji') {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        this.sourceSubnet = sourceSubnet;
    }

    /**
     * Generate cryptographic proof for a transaction event
     * This is the CORE INNOVATION of AVAX-CPoE!
     */
    async generateProof(
        transactionHash: string,
        options: ProofGenerationOptions = {}
    ): Promise<Proof> {
        console.log('🏭 AVAX-CPoE: Generating proof for transaction:', transactionHash);

        try {
            // Step 1: Get transaction receipt from blockchain
            const receipt = await this.provider.getTransactionReceipt(transactionHash);
            if (!receipt) {
                throw new Error(`Transaction ${transactionHash} not found`);
            }

            console.log('✅ Transaction receipt found, block:', receipt.blockNumber);

            // Step 2: Get full block data
            const block = await this.provider.getBlock(receipt.blockHash);
            if (!block) {
                throw new Error(`Block ${receipt.blockHash} not found`);
            }

            // Step 3: Extract target event (log)
            const logIndex = options.logIndex || 0;
            if (logIndex >= receipt.logs.length) {
                throw new Error(`Log index ${logIndex} out of bounds. Transaction has ${receipt.logs.length} logs`);
            }

            const targetLog = receipt.logs[logIndex];
            console.log('✅ Target event extracted:', targetLog.address);

            // Step 4: Generate Merkle proof for event inclusion
            const merkleProof = CryptoUtils.generateMerkleProof(receipt.logs, logIndex);
            console.log('✅ Merkle proof generated, root:', merkleProof.root.substring(0, 10) + '...');

            // Step 5: Create validator signatures (simplified for demo)
            const validatorSetHash = CryptoUtils.generateValidatorSetHash(block.number);
            const blockSignature = CryptoUtils.createBlockSignature(block.hash, validatorSetHash);
            console.log('✅ Block signature created');

            // Step 6: Package into standardized proof format
            const proof: Proof = {
                version: '1.0.0',
                type: 'merkle',
                eventId: transactionHash,
                sourceSubnet: this.sourceSubnet,
                blockHeight: block.number,
                blockHash: block.hash,
                merkleProof,
                eventData: {
                    address: targetLog.address,
                    topics: targetLog.topics,
                    data: targetLog.data,
                    transactionHash: targetLog.transactionHash,
                    logIndex: targetLog.logIndex
                },
                signatures: {
                    blockSignature,
                    validatorSetHash
                },
                timestamp: Date.now()
            };

            console.log(' PROOF GENERATED SUCCESSFULLY!');
            console.log(' Proof size:', JSON.stringify(proof).length, 'bytes');

            return proof;

        } catch (error) {
            console.error(' Proof generation failed:', error);
            throw new Error(`Proof generation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Verify cryptographic proof validity
     * This runs the complete verification algorithm!
     */
    async verifyProof(proof: Proof): Promise<VerificationResult> {
        console.log(' AVAX-CPoE: Verifying proof for event:', proof.eventId);

        const result: VerificationResult = {
            isValid: false,
            details: {
                merkleValid: false,
                signatureValid: false,
                blockValid: false,
                eventValid: false
            },
            errors: []
        };

        try {
            // Step 1: Verify proof format and version
            if (proof.version !== '1.0.0') {
                result.errors?.push('Unsupported proof version');
                return result;
            }

            console.log(' Proof format valid');

            // Step 2: Verify block exists on blockchain
            try {
                const block = await this.provider.getBlock(proof.blockHash);
                if (!block || block.number !== proof.blockHeight) {
                    result.errors?.push('Block validation failed');
                    return result;
                }
                result.details.blockValid = true;
                console.log(' Block validation passed');
            } catch (error) {
                result.errors?.push(`Block verification error: ${error instanceof Error ? error.message : String(error)}`);
                return result;
            }

            // Step 3: Verify Merkle proof
            const merkleValid = CryptoUtils.verifyMerkleProof(
                proof.merkleProof.leaf,
                proof.merkleProof.proof,
                proof.merkleProof.root,
                proof.merkleProof.index
            );

            if (!merkleValid) {
                result.errors?.push('Merkle proof verification failed');
                return result;
            }
            result.details.merkleValid = true;
            console.log(' Merkle proof verification passed');

            // Step 4: Verify block signature
            const signatureValid = CryptoUtils.verifyBlockSignature(
                proof.blockHash,
                proof.signatures.validatorSetHash,
                proof.signatures.blockSignature
            );

            if (!signatureValid) {
                result.errors?.push('Block signature verification failed');
                return result;
            }
            result.details.signatureValid = true;
            console.log(' Signature verification passed');

            // Step 5: Verify event data integrity
            const reconstructedLeaf = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(
                    ['address', 'bytes32[]', 'bytes', 'uint256'],
                    [
                        proof.eventData.address,
                        proof.eventData.topics,
                        proof.eventData.data,
                        proof.eventData.logIndex
                    ]
                )
            );

            if (reconstructedLeaf !== proof.merkleProof.leaf) {
                result.errors?.push('Event data integrity check failed');
                return result;
            }
            result.details.eventValid = true;
            console.log(' Event data integrity verified');

            // All checks passed!
            result.isValid = true;
            console.log(' PROOF VERIFICATION SUCCESSFUL!');

            return result;

        } catch (error) {
            console.error(' Proof verification failed:', error);
            result.errors?.push(`Verification error: ${error instanceof Error ? error.message : String(error)}`);
            return result;
        }
    }

    /**
     * Extract specific data from proof (helper method)
     */
    extractEventData(proof: Proof, abiFragment: string[]): any {
        try {
            const iface = new ethers.utils.Interface([`event ${abiFragment.join(' ')}`]);
            const decoded = iface.parseLog({
                topics: proof.eventData.topics,
                data: proof.eventData.data
            });
            return decoded.args;
        } catch (error) {
            throw new Error(`Failed to decode event data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get proof summary for display
     */
    getProofSummary(proof: Proof): string {
        return `
🔗 AVAX-CPoE Proof Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Event ID: ${proof.eventId}
🏔️ Source: ${proof.sourceSubnet}
📦 Block: ${proof.blockHeight}
🌳 Merkle Root: ${proof.merkleProof.root.substring(0, 20)}...
✍️ Signature: ${proof.signatures.blockSignature.substring(0, 20)}...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
  }
}