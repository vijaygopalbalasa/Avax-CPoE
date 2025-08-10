import { ethers } from 'ethers';

export class CryptoUtils {
    // Generate Merkle proof for transaction logs
    static generateMerkleProof(logs: any[], targetIndex: number): {
        leaf: string;
        proof: string[];
        root: string;
        index: number;
    } {
        if (logs.length === 0) {
            throw new Error('No logs provided for Merkle proof generation');
        }

        if (targetIndex >= logs.length) {
            throw new Error('Target index out of bounds');
        }

        // Convert logs to leaves (hash each log)
        const leaves = logs.map(log =>
            ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(
                    ['address', 'bytes32[]', 'bytes', 'uint256'],
                    [log.address, log.topics, log.data, log.logIndex]
                )
            )
        );

        const targetLeaf = leaves[targetIndex];

        // Build Merkle tree and generate proof
        const proof: string[] = [];
        let currentLevel = [...leaves];
        let currentIndex = targetIndex;

        // Pad to power of 2 if needed
        while (currentLevel.length > 1) {
            const nextLevel: string[] = [];

            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = currentLevel[i + 1] || left; // Duplicate last element if odd

                // If current index is part of this pair, add sibling to proof
                if (i === currentIndex || i + 1 === currentIndex) {
                    const sibling = (i === currentIndex) ? right : left;
                    if (sibling !== left || i + 1 < currentLevel.length) {
                        proof.push(sibling);
                    }
                }

                // Create parent node
                const combined = ethers.utils.keccak256(
                    ethers.utils.concat([
                        ethers.utils.arrayify(left),
                        ethers.utils.arrayify(right)
                    ])
                );
                nextLevel.push(combined);
            }

            currentIndex = Math.floor(currentIndex / 2);
            currentLevel = nextLevel;
        }

        return {
            leaf: targetLeaf,
            proof,
            root: currentLevel[0],
            index: targetIndex
        };
    }

    // Verify Merkle proof
    static verifyMerkleProof(
        leaf: string,
        proof: string[],
        root: string,
        index: number
    ): boolean {
        let computedHash = leaf;
        let currentIndex = index;

        for (const proofElement of proof) {
            if (currentIndex % 2 === 0) {
                // Current node is left child
                computedHash = ethers.utils.keccak256(
                    ethers.utils.concat([
                        ethers.utils.arrayify(computedHash),
                        ethers.utils.arrayify(proofElement)
                    ])
                );
            } else {
                // Current node is right child
                computedHash = ethers.utils.keccak256(
                    ethers.utils.concat([
                        ethers.utils.arrayify(proofElement),
                        ethers.utils.arrayify(computedHash)
                    ])
                );
            }
            currentIndex = Math.floor(currentIndex / 2);
        }

        return computedHash === root;
    }

    // Create simplified block signature (in real implementation, this would use BLS)
    static createBlockSignature(blockHash: string, validatorSetHash: string): string {
        return ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
                ['bytes32', 'bytes32', 'string'],
                [blockHash, validatorSetHash, 'AVAX_CPOE_SIGNATURE']
            )
        );
    }

    // Verify block signature
    static verifyBlockSignature(
        blockHash: string,
        validatorSetHash: string,
        signature: string
    ): boolean {
        const expectedSignature = this.createBlockSignature(blockHash, validatorSetHash);
        return signature === expectedSignature;
    }

    // Generate deterministic validator set hash (simplified)
    static generateValidatorSetHash(blockNumber: number): string {
        return ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
                ['uint256', 'string'],
                [blockNumber, 'AVALANCHE_VALIDATORS']
            )
        );
    }
}