import { ContractTransactionResponse } from 'ethers';
/**
 * Token information returned by the Factory
 */
export interface TokenInfo {
    tokenAddress: string;
    name: string;
    symbol: string;
    deployer: string;
    time: bigint;
    metadata: string;
    marketCapInBNB: bigint;
    nftId: bigint;
    totalFeesGenerated: bigint;
}
/**
 * Liquidity configuration for token deployment
 */
export interface LiquidityConfig {
    sqrtPriceX96: bigint;
    tickLower: number;
    tickUpper: number;
    amount0Desired: bigint;
    amount1Desired: bigint;
    virtualAmount: bigint;
    penaltyMultiplier: bigint;
}
/**
 * Options for deploying a new token
 */
export interface DeployTokenOptions {
    name: string;
    symbol: string;
    metadata: string;
    saltSeed?: string;
    configId?: number;
    initialBuyBNB?: bigint;
}
/**
 * Result of token deployment
 */
export interface DeployTokenResult {
    tokenAddress: string;
    transactionHash: string;
    tokensReceived: bigint;
    transaction: ContractTransactionResponse;
    receipt: any;
}
/**
 * Fee collection result
 */
export interface FeeCollectionResult {
    tokenFeesCollected: bigint;
    wbnbFeesCollected: bigint;
    creatorBNBPaid: bigint;
    tokensBoughtAndBurned: bigint;
    transactionHash: string;
}
/**
 * Event data for Buy/Sell events
 */
export interface TradeEvent {
    trader: string;
    pool: string;
    token: string;
    amountTokens: bigint;
    sqrtPriceX96: bigint;
    priceX96: bigint;
    totalFeesBNB: bigint;
    totalFeesToken: bigint;
    blockNumber: number;
    transactionHash: string;
}
/**
 * Event data for token creation
 */
export interface TokenCreatedEvent {
    tokenAddress: string;
    deployer: string;
    timestamp: bigint;
    blockNumber: number;
    transactionHash: string;
}
/**
 * Token pair information
 */
export interface TokenPair {
    pool: string;
    token: string;
    factory: string;
}
