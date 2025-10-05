import { JsonRpcProvider, Signer } from 'ethers';
import { Factory } from './contracts/Factory';
import { Token } from './contracts/Token';
import { Indexer } from './contracts/Indexer';
/**
 * Configuration options for the Loncher SDK
 */
export interface LoncherSDKConfig {
    /** Factory contract address */
    factoryAddress: string;
    /** Indexer contract address */
    indexerAddress: string;
    /** RPC URL for the BSC network (required if no provider or signer specified) */
    rpcUrl?: string;
    /** Custom provider (optional, overrides rpcUrl) */
    provider?: JsonRpcProvider;
    /** Ethers Signer instance for signing transactions (optional) */
    signer?: Signer;
}
/**
 * Main SDK class for interacting with the Loncher platform
 */
export declare class LoncherSDK {
    factory: Factory;
    indexer: Indexer;
    provider: JsonRpcProvider;
    signer?: Signer;
    private factoryAddress;
    private indexerAddress;
    /**
     * Create a new Loncher SDK instance
     * @param config - SDK configuration
     */
    constructor(config: LoncherSDKConfig);
    /**
     * Get a Token instance for a specific token address
     * @param tokenAddress - Token contract address
     * @returns Token instance
     */
    getToken(tokenAddress: string): Token;
    /**
     * Get the current network chain ID
     * @returns Chain ID
     */
    getChainId(): Promise<bigint>;
    /**
     * Verify that the SDK is connected to BSC mainnet
     * @throws Error if not on BSC mainnet
     */
    verifyNetwork(): Promise<void>;
    /**
     * Get the current block number
     * @returns Block number
     */
    getBlockNumber(): Promise<number>;
    /**
     * Get the BNB balance of an address
     * @param address - Address to check
     * @returns Balance in wei
     */
    getBNBBalance(address: string): Promise<bigint>;
    /**
     * Get the address of the connected signer
     * @returns Signer address
     * @throws Error if no signer is configured
     */
    getSignerAddress(): Promise<string>;
    /**
     * Check if a signer is configured
     * @returns True if signer is available
     */
    hasSigner(): boolean;
    /**
     * Get WBNB token address
     * @returns WBNB address
     */
    getWBNBAddress(): string;
    /**
     * Get PancakeSwap V3 swap router address
     * @returns Swap router address
     */
    getSwapRouterAddress(): string;
    /**
     * Disconnect and cleanup
     */
    disconnect(): void;
}
