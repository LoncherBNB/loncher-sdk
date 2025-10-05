"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
const ethers_1 = require("ethers");
const Factory_json_1 = __importDefault(require("../abis/Factory.json"));
/**
 * Factory contract wrapper for interacting with the Loncher token factory
 */
class Factory {
    /**
     * Create a new Factory instance
     * @param address - Factory contract address
     * @param runner - Contract runner (provider or signer)
     */
    constructor(address, runner) {
        this.contract = new ethers_1.Contract(address, Factory_json_1.default, runner);
    }
    /**
     * Get the underlying contract instance
     */
    getContract() {
        return this.contract;
    }
    /**
     * Deploy a new token with optional initial buy
     * @param options - Token deployment options
     * @returns Deployment result with token address and transaction details
     */
    async deployToken(options) {
        const { name, symbol, metadata, saltSeed = (0, ethers_1.randomBytes)(32), configId = 0, initialBuyBNB = 0n, } = options;
        const salt = typeof saltSeed === 'string' ? saltSeed : (0, ethers_1.keccak256)(saltSeed);
        const tx = await this.contract.deployCoin(name, symbol, metadata, salt, configId, {
            value: initialBuyBNB,
        });
        const receipt = await tx.wait();
        // Extract token address from ERC20TokenCreated event
        const tokenCreatedEvent = receipt.logs.find((log) => {
            try {
                const parsed = this.contract.interface.parseLog(log);
                return parsed?.name === 'ERC20TokenCreated';
            }
            catch {
                return false;
            }
        });
        let tokenAddress = '';
        let tokensReceived = 0n;
        if (tokenCreatedEvent) {
            const parsed = this.contract.interface.parseLog(tokenCreatedEvent);
            tokenAddress = parsed?.args[0];
        }
        // Extract tokens received from return value if available
        if (receipt.logs.length > 0) {
            try {
                tokensReceived = BigInt(initialBuyBNB > 0 ? receipt.logs[0].data : 0);
            }
            catch {
                tokensReceived = 0n;
            }
        }
        return {
            tokenAddress,
            transactionHash: receipt.hash,
            tokensReceived,
            transaction: tx,
            receipt,
        };
    }
    /**
     * Get token information by address
     * @param tokenAddress - Token contract address
     * @returns Token information
     */
    async getTokenInfo(tokenAddress) {
        const info = await this.contract.tokenInfoByAddress(tokenAddress);
        return {
            tokenAddress: info.tokenAddress,
            name: info.name,
            symbol: info.symbol,
            deployer: info.deployer,
            time: info.time,
            metadata: info.metadata,
            marketCapInBNB: info.marketCapInBNB,
            nftId: info.nftId,
            totalFeesGenerated: info.totalFeesGenerated,
        };
    }
    /**
     * Get token market cap in BNB
     * @param tokenAddress - Token contract address
     * @returns Market cap in BNB (wei)
     */
    async getTokenMarketCap(tokenAddress) {
        return await this.contract.getTokenMarketCap(tokenAddress);
    }
    /**
     * Get all tokens deployed by a specific address
     * @param deployer - Deployer address
     * @returns Array of token addresses
     */
    async getTokensByDeployer(deployer) {
        return await this.contract.getAllTokensByDeployer(deployer);
    }
    /**
     * Get paginated list of deployed tokens
     * @param page - Page number (0-indexed)
     * @param order - 0 for newest first, 1 for oldest first
     * @returns Array of token information
     */
    async getDeploysByPage(page, order = 0) {
        const tokens = await this.contract.getDeploysByPage(page, order);
        return tokens.map((info) => ({
            tokenAddress: info.tokenAddress,
            name: info.name,
            symbol: info.symbol,
            deployer: info.deployer,
            time: info.time,
            metadata: info.metadata,
            marketCapInBNB: info.marketCapInBNB,
            nftId: info.nftId,
            totalFeesGenerated: info.totalFeesGenerated,
        }));
    }
    /**
     * Get total number of deployed tokens
     * @returns Token count
     */
    async getTokenCount() {
        return await this.contract.tokenCount();
    }
    /**
     * Get liquidity configuration by ID
     * @param configId - Configuration ID
     * @returns Liquidity configuration
     */
    async getLiquidityConfig(configId) {
        const config = await this.contract.getLiquidityConfig(configId);
        return {
            sqrtPriceX96: config.sqrtPriceX96,
            tickLower: config.tickLower,
            tickUpper: config.tickUpper,
            amount0Desired: config.amount0Desired,
            amount1Desired: config.amount1Desired,
            virtualAmount: config.virtualAmount,
            penaltyMultiplier: config.penaltyMultiplier,
        };
    }
    /**
     * Get total number of liquidity configurations
     * @returns Configuration count
     */
    async getLiquidityConfigCount() {
        return await this.contract.liquidityConfigCount();
    }
    /**
     * Collect fees and execute buyback for a token
     * @param tokenAddress - Token contract address
     * @returns Fee collection result
     */
    async collectFeesAndBuyback(tokenAddress) {
        const tx = await this.contract.collectFeesAndBuyback(tokenAddress);
        const receipt = await tx.wait();
        // Parse return values from transaction receipt
        const [tokenFeesCollected, wbnbFeesCollected, creatorBNBPaid, tokensBoughtAndBurned] = receipt.logs.length > 0 ? [0n, 0n, 0n, 0n] : [0n, 0n, 0n, 0n];
        return {
            tokenFeesCollected,
            wbnbFeesCollected,
            creatorBNBPaid,
            tokensBoughtAndBurned,
            transactionHash: receipt.hash,
        };
    }
    /**
     * Get fees generated by a token
     * @param tokenAddress - Token contract address
     * @returns Total fees generated in BNB (wei)
     */
    async getTokenFeesGenerated(tokenAddress) {
        return await this.contract.getTokenFeesGenerated(tokenAddress);
    }
    /**
     * Get fees already claimed for a token
     * @param tokenAddress - Token contract address
     * @returns Total fees claimed in BNB (wei)
     */
    async getTokenFeesClaimed(tokenAddress) {
        return await this.contract.getTokenFeesClaimed(tokenAddress);
    }
    /**
     * Get the pool address for a token
     * @param tokenAddress - Token contract address
     * @returns Pool address
     */
    async getTokenPool(tokenAddress) {
        return await this.contract.tokenToPool(tokenAddress);
    }
    /**
     * Check if token deployment is enabled
     * @returns True if enabled
     */
    async isDeployCoinEnabled() {
        return await this.contract.deployCoinEnabled();
    }
    /**
     * Get the platform controller address
     * @returns Controller address
     */
    async getPlatformController() {
        return await this.contract.platformController();
    }
    /**
     * Get the indexer contract address
     * @returns Indexer address
     */
    async getIndexerAddress() {
        return await this.contract.indexer();
    }
    /**
     * Get the buyback pool address
     * @returns Buyback pool address
     */
    async getBuybackPool() {
        return await this.contract.buybackPool();
    }
    /**
     * Get the buyback token address
     * @returns Buyback token address
     */
    async getBuybackToken() {
        return await this.contract.buybackToken();
    }
}
exports.Factory = Factory;
