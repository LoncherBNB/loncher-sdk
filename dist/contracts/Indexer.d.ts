import { Contract, ContractRunner } from 'ethers';
import { TradeEvent, TokenCreatedEvent } from '../types';
/**
 * Indexer contract wrapper for listening to platform events
 */
export declare class Indexer {
    private contract;
    /**
     * Create a new Indexer instance
     * @param address - Indexer contract address
     * @param runner - Contract runner (provider or signer)
     */
    constructor(address: string, runner: ContractRunner);
    /**
     * Get the underlying contract instance
     */
    getContract(): Contract;
    /**
     * Get the factory address
     * @returns Factory address
     */
    getFactoryAddress(): Promise<string>;
    /**
     * Check if an address is authorized
     * @param address - Address to check
     * @returns True if authorized
     */
    isAuthorized(address: string): Promise<boolean>;
    /**
     * Listen for token creation events
     * @param callback - Callback function to handle events
     * @param fromBlock - Starting block number (optional)
     */
    onTokenCreated(callback: (event: TokenCreatedEvent) => void, fromBlock?: number): void;
    /**
     * Listen for buy events
     * @param callback - Callback function to handle events
     * @param tokenAddress - Filter by specific token (optional)
     */
    onBuy(callback: (event: TradeEvent) => void, tokenAddress?: string): void;
    /**
     * Listen for sell events
     * @param callback - Callback function to handle events
     * @param tokenAddress - Filter by specific token (optional)
     */
    onSell(callback: (event: TradeEvent) => void, tokenAddress?: string): void;
    /**
     * Query historical token creation events
     * @param fromBlock - Starting block
     * @param toBlock - Ending block (optional, defaults to 'latest')
     * @returns Array of token creation events
     */
    queryTokenCreated(fromBlock: number, toBlock?: number | 'latest'): Promise<TokenCreatedEvent[]>;
    /**
     * Query historical buy events
     * @param fromBlock - Starting block
     * @param toBlock - Ending block (optional, defaults to 'latest')
     * @param tokenAddress - Filter by specific token (optional)
     * @returns Array of buy events
     */
    queryBuyEvents(fromBlock: number, toBlock?: number | 'latest', tokenAddress?: string): Promise<TradeEvent[]>;
    /**
     * Query historical sell events
     * @param fromBlock - Starting block
     * @param toBlock - Ending block (optional, defaults to 'latest')
     * @param tokenAddress - Filter by specific token (optional)
     * @returns Array of sell events
     */
    querySellEvents(fromBlock: number, toBlock?: number | 'latest', tokenAddress?: string): Promise<TradeEvent[]>;
    /**
     * Stop listening to all events
     */
    removeAllListeners(): void;
}
