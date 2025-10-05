"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const ethers_1 = require("ethers");
const Token_json_1 = __importDefault(require("../abis/Token.json"));
/**
 * Token contract wrapper for interacting with deployed Loncher tokens
 */
class Token {
    /**
     * Create a new Token instance
     * @param address - Token contract address
     * @param runner - Contract runner (provider or signer)
     */
    constructor(address, runner) {
        this.contract = new ethers_1.Contract(address, Token_json_1.default, runner);
    }
    /**
     * Get the underlying contract instance
     */
    getContract() {
        return this.contract;
    }
    /**
     * Get token name
     * @returns Token name
     */
    async name() {
        return await this.contract.name();
    }
    /**
     * Get token symbol
     * @returns Token symbol
     */
    async symbol() {
        return await this.contract.symbol();
    }
    /**
     * Get token decimals
     * @returns Token decimals (always 18 for Loncher tokens)
     */
    async decimals() {
        return await this.contract.decimals();
    }
    /**
     * Get total supply
     * @returns Total supply in wei
     */
    async totalSupply() {
        return await this.contract.totalSupply();
    }
    /**
     * Get balance of an address
     * @param address - Address to check balance for
     * @returns Balance in wei
     */
    async balanceOf(address) {
        return await this.contract.balanceOf(address);
    }
    /**
     * Transfer tokens to another address
     * @param to - Recipient address
     * @param amount - Amount in wei
     * @returns Transaction response
     */
    async transfer(to, amount) {
        const tx = await this.contract.transfer(to, amount);
        return await tx.wait();
    }
    /**
     * Approve spender to spend tokens
     * @param spender - Spender address
     * @param amount - Amount in wei
     * @returns Transaction response
     */
    async approve(spender, amount) {
        const tx = await this.contract.approve(spender, amount);
        return await tx.wait();
    }
    /**
     * Get allowance for a spender
     * @param owner - Owner address
     * @param spender - Spender address
     * @returns Allowance in wei
     */
    async allowance(owner, spender) {
        return await this.contract.allowance(owner, spender);
    }
    /**
     * Transfer tokens from one address to another
     * @param from - Sender address
     * @param to - Recipient address
     * @param amount - Amount in wei
     * @returns Transaction response
     */
    async transferFrom(from, to, amount) {
        const tx = await this.contract.transferFrom(from, to, amount);
        return await tx.wait();
    }
    /**
     * Burn tokens
     * @param amount - Amount to burn in wei
     * @returns Transaction response
     */
    async burn(amount) {
        const tx = await this.contract.burn(amount);
        return await tx.wait();
    }
    /**
     * Burn tokens from another address (requires approval)
     * @param account - Account to burn from
     * @param amount - Amount to burn in wei
     * @returns Transaction response
     */
    async burnFrom(account, amount) {
        const tx = await this.contract.burnFrom(account, amount);
        return await tx.wait();
    }
    /**
     * Get the token pair information (pool, token, factory)
     * @returns Token pair information
     */
    async getTokenPair() {
        const [pool, token, factory] = await this.contract.getTokenPair();
        return { pool, token, factory };
    }
    /**
     * Check if the launch period is still active
     * Launch period has special trading limits for the first 5 blocks
     * @returns True if launch period is active
     */
    async isLaunchPeriodActive() {
        return await this.contract.isLaunchPeriodActive();
    }
    /**
     * Get the platform (Factory) address
     * @returns Platform address
     */
    async platform() {
        return await this.contract.platform();
    }
    /**
     * Get the indexer contract address
     * @returns Indexer address
     */
    async indexer() {
        return await this.contract.indexer();
    }
}
exports.Token = Token;
