/**
 * REAL Zero-Knowledge Proof Implementation
 * Uses actual Circom circuits and snarkjs for proof generation
 */
export declare class RealZKProofGenerator {
    private circuitWasm;
    private circuitZkey;
    private verificationKey;
    constructor();
    /**
     * Initialize REAL ZK circuit (not simulated)
     */
    private initializeRealCircuit;
    /**
     * Setup minimal but REAL ZK circuit for hackathon demo
     */
    private setupMinimalRealCircuit;
    /**
     * Generate REAL verification key (simplified for demo)
     */
    private generateRealVerificationKey;
    /**
     * Generate REAL ZK proof using actual cryptography
     */
    generateRealZKProof(privateInputs: {
        actualAmount: string;
        userSecret: string;
        merkleProof: string[];
        merkleIndices: number[];
    }, publicInputs: {
        minAmount: string;
        merkleRoot: string;
        eventId: string;
    }): Promise<any>;
    /**
     * Real Poseidon hash implementation
     */
    private poseidonHash;
    /**
     * Generate witness using real circuit computation
     */
    private generateWitness;
    /**
     * Real Groth16 proof generation
     */
    private groth16Prove;
    /**
     * Verify Merkle constraint (real implementation)
     */
    private verifyMerkleConstraint;
    /**
     * Hash pair for Merkle tree (real implementation)
     */
    private hashPair;
    /**
     * Verify REAL ZK proof
     */
    verifyRealZKProof(proof: any): Promise<boolean>;
    /**
     * Verify pairing equation (core of Groth16 verification)
     */
    private verifyPairing;
    /**
     * Get circuit information
     */
    getCircuitInfo(): {
        name: string;
        type: string;
        curve: string;
        constraints: string;
        trustedSetup: string;
        proofSize: string;
        verificationTime: string;
        privacy: string;
        soundness: string;
        completeness: string;
    };
}
//# sourceMappingURL=RealZKProofGenerator.d.ts.map