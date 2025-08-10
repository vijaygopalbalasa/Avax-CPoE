import { Proof, ProofGenerationOptions, VerificationResult } from './types';
export declare class AvaxCPoE {
    private provider;
    private sourceSubnet;
    constructor(rpcUrl: string, sourceSubnet?: string);
    /**
     * Generate cryptographic proof for a transaction event
     * This is the CORE INNOVATION of AVAX-CPoE!
     */
    generateProof(transactionHash: string, options?: ProofGenerationOptions): Promise<Proof>;
    /**
     * Verify cryptographic proof validity
     * This runs the complete verification algorithm!
     */
    verifyProof(proof: Proof): Promise<VerificationResult>;
    /**
     * Extract specific data from proof (helper method)
     */
    extractEventData(proof: Proof, abiFragment: string[]): any;
    /**
     * Get proof summary for display
     */
    getProofSummary(proof: Proof): string;
}
//# sourceMappingURL=AvaxCPoE.d.ts.map