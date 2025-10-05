import { Contract, ContractRunner, EventLog } from 'ethers';
import IndexerABI from '../abis/Indexer.json';
import { TradeEvent, TokenCreatedEvent } from '../types';

/**
 * Indexer contract wrapper for listening to platform events
 */
export class Indexer {
  private contract: Contract;

  /**
   * Create a new Indexer instance
   * @param address - Indexer contract address
   * @param runner - Contract runner (provider or signer)
   */
  constructor(address: string, runner: ContractRunner) {
    this.contract = new Contract(address, IndexerABI, runner);
  }

  /**
   * Get the underlying contract instance
   */
  getContract(): Contract {
    return this.contract;
  }

  /**
   * Get the factory address
   * @returns Factory address
   */
  async getFactoryAddress(): Promise<string> {
    return await this.contract.factory();
  }

  /**
   * Check if an address is authorized
   * @param address - Address to check
   * @returns True if authorized
   */
  async isAuthorized(address: string): Promise<boolean> {
    return await this.contract.authorizedAddresses(address);
  }

  /**
   * Listen for token creation events
   * @param callback - Callback function to handle events
   * @param fromBlock - Starting block number (optional)
   */
  onTokenCreated(
    callback: (event: TokenCreatedEvent) => void,
    fromBlock?: number
  ): void {
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
  onBuy(
    callback: (event: TradeEvent) => void,
    tokenAddress?: string
  ): void {
    const filter = tokenAddress
      ? this.contract.filters.Buy(null, null, tokenAddress)
      : this.contract.filters.Buy();

    this.contract.on(
      filter,
      (buyer, pool, token, amountTokens, sqrtPriceX96, priceX96, totalFeesBNB, totalFeesToken, event) => {
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
      }
    );
  }

  /**
   * Listen for sell events
   * @param callback - Callback function to handle events
   * @param tokenAddress - Filter by specific token (optional)
   */
  onSell(
    callback: (event: TradeEvent) => void,
    tokenAddress?: string
  ): void {
    const filter = tokenAddress
      ? this.contract.filters.Sell(null, null, tokenAddress)
      : this.contract.filters.Sell();

    this.contract.on(
      filter,
      (seller, pool, token, amountTokens, sqrtPriceX96, priceX96, totalFeesBNB, totalFeesToken, event) => {
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
      }
    );
  }

  /**
   * Query historical token creation events
   * @param fromBlock - Starting block
   * @param toBlock - Ending block (optional, defaults to 'latest')
   * @returns Array of token creation events
   */
  async queryTokenCreated(
    fromBlock: number,
    toBlock: number | 'latest' = 'latest'
  ): Promise<TokenCreatedEvent[]> {
    const filter = this.contract.filters.ERC20TokenCreated();
    const events = await this.contract.queryFilter(filter, fromBlock, toBlock);

    return events.map((event) => {
      const log = event as EventLog;
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
  async queryBuyEvents(
    fromBlock: number,
    toBlock: number | 'latest' = 'latest',
    tokenAddress?: string
  ): Promise<TradeEvent[]> {
    const filter = tokenAddress
      ? this.contract.filters.Buy(null, null, tokenAddress)
      : this.contract.filters.Buy();

    const events = await this.contract.queryFilter(filter, fromBlock, toBlock);

    return events.map((event) => {
      const log = event as EventLog;
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
  async querySellEvents(
    fromBlock: number,
    toBlock: number | 'latest' = 'latest',
    tokenAddress?: string
  ): Promise<TradeEvent[]> {
    const filter = tokenAddress
      ? this.contract.filters.Sell(null, null, tokenAddress)
      : this.contract.filters.Sell();

    const events = await this.contract.queryFilter(filter, fromBlock, toBlock);

    return events.map((event) => {
      const log = event as EventLog;
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
  removeAllListeners(): void {
    this.contract.removeAllListeners();
  }
}
