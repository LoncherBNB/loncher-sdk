import { Contract, ContractRunner } from 'ethers';
import { TokenPair } from '../types';
/**
 * Token contract wrapper for interacting with deployed Loncher tokens
 */
export declare class Token {
    private contract;
    /**
     * Create a new Token instance
     * @param address - Token contract address
     * @param runner - Contract runner (provider or signer)
     */
    constructor(address: string, runner: ContractRunner);
    /**
     * Get the underlying contract instance
     */
    getContract(): Contract;
    /**
     * Get token name
     * @returns Token name
     */
    name(): Promise<string>;
    /**
     * Get token symbol
     * @returns Token symbol
     */
    symbol(): Promise<string>;
    /**
     * Get token decimals
     * @returns Token decimals (always 18 for Loncher tokens)
     */
    decimals(): Promise<number>;
    /**
     * Get total supply
     * @returns Total supply in wei
     */
    totalSupply(): Promise<bigint>;
    /**
     * Get balance of an address
     * @param address - Address to check balance for
     * @returns Balance in wei
     */
    balanceOf(address: string): Promise<bigint>;
    /**
     * Transfer tokens to another address
     * @param to - Recipient address
     * @param amount - Amount in wei
     * @returns Transaction response
     */
    transfer(to: string, amount: bigint): Promise<any>;
    /**
     * Approve spender to spend tokens
     * @param spender - Spender address
     * @param amount - Amount in wei
     * @returns Transaction response
     */
    approve(spender: string, amount: bigint): Promise<any>;
    /**
     * Get allowance for a spender
     * @param owner - Owner address
     * @param spender - Spender address
     * @returns Allowance in wei
     */
    allowance(owner: string, spender: string): Promise<bigint>;
    /**
     * Transfer tokens from one address to another
     * @param from - Sender address
     * @param to - Recipient address
     * @param amount - Amount in wei
     * @returns Transaction response
     */
    transferFrom(from: string, to: string, amount: bigint): Promise<any>;
    /**
     * Burn tokens
     * @param amount - Amount to burn in wei
     * @returns Transaction response
     */
    burn(amount: bigint): Promise<any>;
    /**
     * Burn tokens from another address (requires approval)
     * @param account - Account to burn from
     * @param amount - Amount to burn in wei
     * @returns Transaction response
     */
    burnFrom(account: string, amount: bigint): Promise<any>;
    /**
     * Get the token pair information (pool, token, factory)
     * @returns Token pair information
     */
    getTokenPair(): Promise<TokenPair>;
    /**
     * Check if the launch period is still active
     * Launch period has special trading limits for the first 5 blocks
     * @returns True if launch period is active
     */
    isLaunchPeriodActive(): Promise<boolean>;
    /**
     * Get the platform (Factory) address
     * @returns Platform address
     */
    platform(): Promise<string>;
    /**
     * Get the indexer contract address
     * @returns Indexer address
     */
    indexer(): Promise<string>;
}
