"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtils = void 0;
const ethers_1 = require("ethers");
class CryptoUtils {
    // Generate Merkle proof for transaction logs
    static generateMerkleProof(logs, targetIndex) {
        if (logs.length === 0) {
            throw new Error('No logs provided for Merkle proof generation');
        }
        if (targetIndex >= logs.length) {
            throw new Error('Target index out of bounds');
        }
        // Convert logs to leaves (hash each log)
        const leaves = logs.map(log => ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(['address', 'bytes32[]', 'bytes', 'uint256'], [log.address, log.topics, log.data, log.logIndex])));
        const targetLeaf = leaves[targetIndex];
        // Build Merkle tree and generate proof
        const proof = [];
        let currentLevel = [...leaves];
        let currentIndex = targetIndex;
        // Pad to power of 2 if needed
        while (currentLevel.length > 1) {
            const nextLevel = [];
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
                const combined = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.concat([
                    ethers_1.ethers.utils.arrayify(left),
                    ethers_1.ethers.utils.arrayify(right)
                ]));
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
    static verifyMerkleProof(leaf, proof, root, index) {
        let computedHash = leaf;
        let currentIndex = index;
        for (const proofElement of proof) {
            if (currentIndex % 2 === 0) {
                // Current node is left child
                computedHash = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.concat([
                    ethers_1.ethers.utils.arrayify(computedHash),
                    ethers_1.ethers.utils.arrayify(proofElement)
                ]));
            }
            else {
                // Current node is right child
                computedHash = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.concat([
                    ethers_1.ethers.utils.arrayify(proofElement),
                    ethers_1.ethers.utils.arrayify(computedHash)
                ]));
            }
            currentIndex = Math.floor(currentIndex / 2);
        }
        return computedHash === root;
    }
    // Create simplified block signature (in real implementation, this would use BLS)
    static createBlockSignature(blockHash, validatorSetHash) {
        return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(['bytes32', 'bytes32', 'string'], [blockHash, validatorSetHash, 'AVAX_CPOE_SIGNATURE']));
    }
    // Verify block signature
    static verifyBlockSignature(blockHash, validatorSetHash, signature) {
        const expectedSignature = this.createBlockSignature(blockHash, validatorSetHash);
        return signature === expectedSignature;
    }
    // Generate deterministic validator set hash (simplified)
    static generateValidatorSetHash(blockNumber) {
        return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(['uint256', 'string'], [blockNumber, 'AVALANCHE_VALIDATORS']));
    }
}
exports.CryptoUtils = CryptoUtils;
//# sourceMappingURL=utils.js.map