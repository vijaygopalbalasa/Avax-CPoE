pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/merkletree.circom";

/**
 * Real ZK Circuit for AVAX Cross-Subnet Proof of Event
 * Proves: actualAmount >= minAmount without revealing actualAmount
 * Uses: Merkle inclusion proof + nullifier for double-spend prevention
 */
template StakeProof(levels) {
    // PRIVATE INPUTS (hidden from everyone)
    signal private input actualAmount;      // Real staked amount (secret)
    signal private input userSecret;        // User's private nullifier seed
    signal private input merklePathElements[levels];  // Merkle proof path
    signal private input merklePathIndices[levels];   // Merkle proof indices
    
    // PUBLIC INPUTS (visible on blockchain)
    signal input minAmount;        // Minimum amount required to prove
    signal input merkleRoot;       // Merkle root of all stakes
    signal input nullifierHash;    // Prevents double-spending
    
    // OUTPUT
    signal output valid;
    
    // CONSTRAINT 1: Prove actualAmount >= minAmount
    // This is the core privacy feature - proves threshold without revealing exact amount
    component geq = GreaterEqualThan(64);
    geq.in[0] <== actualAmount;
    geq.in[1] <== minAmount;
    geq.out === 1;
    
    // CONSTRAINT 2: Prove Merkle inclusion
    // Proves the actualAmount exists in the committed Merkle tree
    component merkleProof = MerkleTreeChecker(levels);
    merkleProof.leaf <== actualAmount;
    merkleProof.root <== merkleRoot;
    for (var i = 0; i < levels; i++) {
        merkleProof.pathElements[i] <== merklePathElements[i];
        merkleProof.pathIndices[i] <== merklePathIndices[i];
    }
    
    // CONSTRAINT 3: Prove nullifier correctness
    // Prevents double-spending by binding secret to amount
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== userSecret;
    nullifierHasher.inputs[1] <== actualAmount;
    nullifierHasher.out === nullifierHash;
    
    // Output valid proof (all constraints satisfied)
    valid <== 1;
}

// Main component with 10 levels (supports up to 1024 stakes)
component main = StakeProof(10);
