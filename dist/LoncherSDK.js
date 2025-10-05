"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoncherSDK = void 0;
const ethers_1 = require("ethers");
const Factory_1 = require("./contracts/Factory");
const Token_1 = require("./contracts/Token");
const Indexer_1 = require("./contracts/Indexer");
const constants_1 = require("./constants");
/**
 * Main SDK class for interacting with the Loncher platform
 */
class LoncherSDK {
    /**
     * Create a new Loncher SDK instance
     * @param config - SDK configuration
     */
    constructor(config) {
        this.factoryAddress = config.factoryAddress;
        this.indexerAddress = config.indexerAddress;
        // Setup signer if provided
        if (config.signer) {
            this.signer = config.signer;
        }
        // Setup provider
        if (config.provider) {
            this.provider = config.provider;
        }
        else if (config.rpcUrl) {
            this.provider = new ethers_1.JsonRpcProvider(config.rpcUrl);
        }
        else if (this.signer && this.signer.provider) {
            // Try to get provider from signer
            this.provider = this.signer.provider;
        }
        else {
            throw new Error('Either provider, rpcUrl, or signer with provider must be provided');
        }
        // Initialize contract instances
        const runner = this.signer || this.provider;
        this.factory = new Factory_1.Factory(config.factoryAddress, runner);
        this.indexer = new Indexer_1.Indexer(config.indexerAddress, runner);
    }
    /**
     * Get a Token instance for a specific token address
     * @param tokenAddress - Token contract address
     * @returns Token instance
     */
    getToken(tokenAddress) {
        const runner = this.signer || this.provider;
        return new Token_1.Token(tokenAddress, runner);
    }
    /**
     * Get the current network chain ID
     * @returns Chain ID
     */
    async getChainId() {
        const network = await this.provider.getNetwork();
        return network.chainId;
    }
    /**
     * Verify that the SDK is connected to BSC mainnet
     * @throws Error if not on BSC mainnet
     */
    async verifyNetwork() {
        const chainId = await this.getChainId();
        if (chainId !== BigInt(constants_1.BSC_CHAIN_ID)) {
            throw new Error(`Wrong network. Expected BSC (${constants_1.BSC_CHAIN_ID}), got ${chainId}`);
        }
    }
    /**
     * Get the current block number
     * @returns Block number
     */
    async getBlockNumber() {
        return await this.provider.getBlockNumber();
    }
    /**
     * Get the BNB balance of an address
     * @param address - Address to check
     * @returns Balance in wei
     */
    async getBNBBalance(address) {
        return await this.provider.getBalance(address);
    }
    /**
     * Get the address of the connected signer
     * @returns Signer address
     * @throws Error if no signer is configured
     */
    async getSignerAddress() {
        if (!this.signer) {
            throw new Error('No signer configured. Provide a signer in config.');
        }
        return await this.signer.getAddress();
    }
    /**
     * Check if a signer is configured
     * @returns True if signer is available
     */
    hasSigner() {
        return !!this.signer;
    }
    /**
     * Get WBNB token address
     * @returns WBNB address
     */
    getWBNBAddress() {
        return constants_1.WBNB_ADDRESS;
    }
    /**
     * Get PancakeSwap V3 swap router address
     * @returns Swap router address
     */
    getSwapRouterAddress() {
        return constants_1.PANCAKE_V3_SWAP_ROUTER;
    }
    /**
     * Disconnect and cleanup
     */
    disconnect() {
        this.indexer.removeAllListeners();
    }
}
exports.LoncherSDK = LoncherSDK;
