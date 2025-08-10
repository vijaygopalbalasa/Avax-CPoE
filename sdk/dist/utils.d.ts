export declare class CryptoUtils {
    static generateMerkleProof(logs: any[], targetIndex: number): {
        leaf: string;
        proof: string[];
        root: string;
        index: number;
    };
    static verifyMerkleProof(leaf: string, proof: string[], root: string, index: number): boolean;
    static createBlockSignature(blockHash: string, validatorSetHash: string): string;
    static verifyBlockSignature(blockHash: string, validatorSetHash: string, signature: string): boolean;
    static generateValidatorSetHash(blockNumber: number): string;
}
//# sourceMappingURL=utils.d.ts.map