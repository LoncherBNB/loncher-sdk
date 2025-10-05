"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indexer = void 0;
const ethers_1 = require("ethers");
const Indexer_json_1 = __importDefault(require("../abis/Indexer.json"));
/**
 * Indexer contract wrapper for listening to platform events
 */
class Indexer {
    /**
     * Create a new Indexer instance
     * @param address - Indexer contract address
     * @param runner - Contract runner (provider or signer)
     */
    constructor(address, runner) {
        this.contract = new ethers_1.Contract(address, Indexer_json_1.default, runner);
    }
    /**
     * Get the underlying contract instance
     */
    getContract() {
        return this.contract;
    }
    /**
     * Get the factory address
     * @returns Factory address
     */
    async getFactoryAddress() {
        return await this.contract.factory();
    }
    /**
     * Check if an address is authorized
     * @param address - Address to check
     * @returns True if authorized
     */
    async isAuthorized(address) {
        return await this.contract.authorizedAddresses(address);
    }
    /**
     * Listen for token creation events
     * @param callback - Callback function to handle events
     * @param fromBlock - Starting block number (optional)
     */
    onTokenCreated(callback, fromBlock) {
        const filter = this.contract.filters.ERC20TokenCreated();
        this.contract.on(filter, (tokenAddress, deployer, timestamp, event) => {
            callback({
                tokenAddress,
                deployer,
                timestamp,
                blockNumber: event.log.blockNumber,
                transactionHash: event.log.transactionHash,
            });
        });
    }
    /**
     * Listen for buy events
     * @param callback - Callback function to handle events
     * @param tokenAddress - Filter by specific token (optional)
     */
    onBuy(callback, tokenAddress) {
        const filter = tokenAddress
            ? this.contract.filters.Buy(null, null, tokenAddress)
            : this.contract.filters.Buy();
        this.contract.on(filter, (buyer, pool, token, amountTokens, sqrtPriceX96, priceX96, totalFeesBNB, totalFeesToken, event) => {
            callback({
                trader: buyer,
                pool,
                token,
                amountTokens,
                sqrtPriceX96,
                priceX96,
                totalFeesBNB,
                totalFeesToken,
                blockNumber: event.log.blockNumber,
                transactionHash: event.log.transactionHash,
            });
        });
    }
    /**
     * Listen for sell events
     * @param callback - Callback function to handle events
     * @param tokenAddress - Filter by specific token (optional)
     */
    onSell(callback, tokenAddress) {
        const filter = tokenAddress
            ? this.contract.filters.Sell(null, null, tokenAddress)
            : this.contract.filters.Sell();
        this.contract.on(filter, (seller, pool, token, amountTokens, sqrtPriceX96, priceX96, totalFeesBNB, totalFeesToken, event) => {
            callback({
                trader: seller,
                pool,
                token,
                amountTokens,
                sqrtPriceX96,
                priceX96,
                totalFeesBNB,
                totalFeesToken,
                blockNumber: event.log.blockNumber,
                transactionHash: event.log.transactionHash,
            });
        });
    }
    /**
     * Query historical token creation events
     * @param fromBlock - Starting block
     * @param toBlock - Ending block (optional, defaults to 'latest')
     * @returns Array of token creation events
     */
    async queryTokenCreated(fromBlock, toBlock = 'latest') {
        const filter = this.contract.filters.ERC20TokenCreated();
        const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
        return events.map((event) => {
            const log = event;
            return {
                tokenAddress: log.args[0],
                deployer: log.args[1],
                timestamp: log.args[2],
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            };
        });
    }
    /**
     * Query historical buy events
     * @param fromBlock - Starting block
     * @param toBlock - Ending block (optional, defaults to 'latest')
     * @param tokenAddress - Filter by specific token (optional)
     * @returns Array of buy events
     */
    async queryBuyEvents(fromBlock, toBlock = 'latest', tokenAddress) {
        const filter = tokenAddress
            ? this.contract.filters.Buy(null, null, tokenAddress)
            : this.contract.filters.Buy();
        const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
        return events.map((event) => {
            const log = event;
            return {
                trader: log.args[0],
                pool: log.args[1],
                token: log.args[2],
                amountTokens: log.args[3],
                sqrtPriceX96: log.args[4],
                priceX96: log.args[5],
                totalFeesBNB: log.args[6],
                totalFeesToken: log.args[7],
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            };
        });
    }
    /**
     * Query historical sell events
     * @param fromBlock - Starting block
     * @param toBlock - Ending block (optional, defaults to 'latest')
     * @param tokenAddress - Filter by specific token (optional)
     * @returns Array of sell events
     */
    async querySellEvents(fromBlock, toBlock = 'latest', tokenAddress) {
        const filter = tokenAddress
            ? this.contract.filters.Sell(null, null, tokenAddress)
            : this.contract.filters.Sell();
        const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
        return events.map((event) => {
            const log = event;
            return {
                trader: log.args[0],
                pool: log.args[1],
                token: log.args[2],
                amountTokens: log.args[3],
                sqrtPriceX96: log.args[4],
                priceX96: log.args[5],
                totalFeesBNB: log.args[6],
                totalFeesToken: log.args[7],
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            };
        });
    }
    /**
     * Stop listening to all events
     */
    removeAllListeners() {
        this.contract.removeAllListeners();
    }
}
exports.Indexer = Indexer;
