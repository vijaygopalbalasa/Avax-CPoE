export interface Proof {
    version: string;
    type: 'merkle';
    eventId: string;
    sourceSubnet: string;
    blockHeight: number;
    blockHash: string;
    merkleProof: {
        leaf: string;
        proof: string[];
        root: string;
        index: number;
    };
    eventData: {
        address: string;
        topics: string[];
        data: string;
        transactionHash: string;
        logIndex: number;
    };
    signatures: {
        blockSignature: string;
        validatorSetHash: string;
    };
    timestamp: number;
}
export interface ProofGenerationOptions {
    sourceRpcUrl?: string;
    logIndex?: number;
    includeFullEventData?: boolean;
}
export interface VerificationResult {
    isValid: boolean;
    errors?: string[];
    details: {
        merkleValid: boolean;
        signatureValid: boolean;
        blockValid: boolean;
        eventValid: boolean;
    };
}
//# sourceMappingURL=types.d.ts.map