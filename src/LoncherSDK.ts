import { JsonRpcProvider, Signer, ContractRunner } from 'ethers';
import { Factory } from './contracts/Factory';
import { Token } from './contracts/Token';
import { Indexer } from './contracts/Indexer';
import { BSC_CHAIN_ID, WBNB_ADDRESS, PANCAKE_V3_SWAP_ROUTER } from './constants';

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
export class LoncherSDK {
  public factory: Factory;
  public indexer: Indexer;
  public provider: JsonRpcProvider;
  public signer?: Signer;
  private factoryAddress: string;
  private indexerAddress: string;

  /**
   * Create a new Loncher SDK instance
   * @param config - SDK configuration
   */
  constructor(config: LoncherSDKConfig) {
    this.factoryAddress = config.factoryAddress;
    this.indexerAddress = config.indexerAddress;

    // Setup signer if provided
    if (config.signer) {
      this.signer = config.signer;
    }

    // Setup provider
    if (config.provider) {
      this.provider = config.provider;
    } else if (config.rpcUrl) {
      this.provider = new JsonRpcProvider(config.rpcUrl);
    } else if (this.signer && this.signer.provider) {
      // Try to get provider from signer
      this.provider = this.signer.provider as JsonRpcProvider;
    } else {
      throw new Error('Either provider, rpcUrl, or signer with provider must be provided');
    }

    // Initialize contract instances
    const runner: ContractRunner = this.signer || this.provider;
    this.factory = new Factory(config.factoryAddress, runner);
    this.indexer = new Indexer(config.indexerAddress, runner);
  }

  /**
   * Get a Token instance for a specific token address
   * @param tokenAddress - Token contract address
   * @returns Token instance
   */
  getToken(tokenAddress: string): Token {
    const runner: ContractRunner = this.signer || this.provider;
    return new Token(tokenAddress, runner);
  }

  /**
   * Get the current network chain ID
   * @returns Chain ID
   */
  async getChainId(): Promise<bigint> {
    const network = await this.provider.getNetwork();
    return network.chainId;
  }

  /**
   * Verify that the SDK is connected to BSC mainnet
   * @throws Error if not on BSC mainnet
   */
  async verifyNetwork(): Promise<void> {
    const chainId = await this.getChainId();
    if (chainId !== BigInt(BSC_CHAIN_ID)) {
      throw new Error(
        `Wrong network. Expected BSC (${BSC_CHAIN_ID}), got ${chainId}`
      );
    }
  }

  /**
   * Get the current block number
   * @returns Block number
   */
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * Get the BNB balance of an address
   * @param address - Address to check
   * @returns Balance in wei
   */
  async getBNBBalance(address: string): Promise<bigint> {
    return await this.provider.getBalance(address);
  }

  /**
   * Get the address of the connected signer
   * @returns Signer address
   * @throws Error if no signer is configured
   */
  async getSignerAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error('No signer configured. Provide a signer in config.');
    }
    return await this.signer.getAddress();
  }

  /**
   * Check if a signer is configured
   * @returns True if signer is available
   */
  hasSigner(): boolean {
    return !!this.signer;
  }

  /**
   * Get WBNB token address
   * @returns WBNB address
   */
  getWBNBAddress(): string {
    return WBNB_ADDRESS;
  }

  /**
   * Get PancakeSwap V3 swap router address
   * @returns Swap router address
   */
  getSwapRouterAddress(): string {
    return PANCAKE_V3_SWAP_ROUTER;
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    this.indexer.removeAllListeners();
  }
}
