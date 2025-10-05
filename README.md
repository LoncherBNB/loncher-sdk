# Loncher SDK

A simple JavaScript/TypeScript SDK for interacting with the Loncher token launchpad platform on Binance Smart Chain.

## Installation

```bash
npm install @loncherbnb/sdk ethers@6
```

## Quick Start

```typescript
import { LoncherSDK } from '@loncherbnb/sdk';
import { parseEther, Wallet, JsonRpcProvider } from 'ethers';

// Create a signer
const provider = new JsonRpcProvider('https://bsc-dataseed.binance.org');
const signer = new Wallet('0x...your_private_key', provider);

// Initialize the SDK
const sdk = new LoncherSDK({
  factoryAddress: '0x236a6B18E30C6073849653cc0f1c46985FD06A8c',
  indexerAddress: '0xb7AB1e21E3A44243361DBa42d8d72213535C083C',
  signer, // Pass ethers Signer instance
});

// Deploy a new token with initial buy
const result = await sdk.factory.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  metadata: JSON.stringify({ description: 'My awesome token' }),
  configId: 0, // Liquidity configuration ID
  initialBuyBNB: parseEther('0.1'), // Buy 0.1 BNB worth on deploy
});

console.log('Token deployed at:', result.tokenAddress);
console.log('Tokens received:', result.tokensReceived);

// Get token information
const tokenInfo = await sdk.factory.getTokenInfo(result.tokenAddress);
console.log('Token name:', tokenInfo.name);
console.log('Market cap:', tokenInfo.marketCapInBNB);

// Interact with the token
const token = sdk.getToken(result.tokenAddress);
const balance = await token.balanceOf(await sdk.getSignerAddress());
console.log('My balance:', balance);
```

## Features

### Factory Contract

Deploy and manage tokens on the Loncher platform:

```typescript
// Deploy a new token
const deployment = await sdk.factory.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  metadata: JSON.stringify({
    description: 'Token description',
    image: 'https://...',
    website: 'https://...',
  }),
  configId: 0,
  initialBuyBNB: parseEther('0.1'),
});

// Get token info
const info = await sdk.factory.getTokenInfo(tokenAddress);

// Get all tokens by deployer
const tokens = await sdk.factory.getTokensByDeployer(deployerAddress);

// Get paginated token list
const page0 = await sdk.factory.getDeploysByPage(0, 0); // newest first

// Get token market cap
const marketCap = await sdk.factory.getTokenMarketCap(tokenAddress);

// Collect fees and execute buyback
const feeResult = await sdk.factory.collectFeesAndBuyback(tokenAddress);
console.log('BNB fees collected:', feeResult.wbnbFeesCollected);
console.log('Tokens burned:', feeResult.tokensBoughtAndBurned);
```

### Token Contract

Interact with deployed tokens (standard ERC20 + custom features):

```typescript
const token = sdk.getToken(tokenAddress);

// Standard ERC20 functions
const name = await token.name();
const symbol = await token.symbol();
const totalSupply = await token.totalSupply();
const balance = await token.balanceOf(address);

// Transfer tokens
await token.transfer(recipientAddress, parseEther('100'));

// Approve spender
await token.approve(spenderAddress, parseEther('1000'));

// Burn tokens
await token.burn(parseEther('50'));

// Get token pair info (pool, token, factory)
const pair = await token.getTokenPair();
console.log('Pool address:', pair.pool);

// Check if launch period is active (first 5 blocks with trading limits)
const isLaunchActive = await token.isLaunchPeriodActive();
```

### Indexer Contract

Listen to platform events and query historical data:

```typescript
// Listen for new token deployments
sdk.indexer.onTokenCreated((event) => {
  console.log('New token deployed:', event.tokenAddress);
  console.log('Deployer:', event.deployer);
  console.log('Timestamp:', event.timestamp);
});

// Listen for buy events on a specific token
sdk.indexer.onBuy((event) => {
  console.log('Buy:', event.amountTokens);
  console.log('Price:', event.priceX96);
}, tokenAddress);

// Listen for sell events
sdk.indexer.onSell((event) => {
  console.log('Sell:', event.amountTokens);
  console.log('Trader:', event.trader);
});

// Query historical events
const fromBlock = 12345678;
const tokens = await sdk.indexer.queryTokenCreated(fromBlock);
const buys = await sdk.indexer.queryBuyEvents(fromBlock, 'latest', tokenAddress);
const sells = await sdk.indexer.querySellEvents(fromBlock);

// Stop listening to events
sdk.indexer.removeAllListeners();
```

## Configuration

### Default Contract Addresses (BSC Mainnet)

```typescript
const FACTORY_ADDRESS = '0x236a6B18E30C6073849653cc0f1c46985FD06A8c';
const INDEXER_ADDRESS = '0xb7AB1e21E3A44243361DBa42d8d72213535C083C';
```

### Initialize with RPC URL (Read-only)

```typescript
const sdk = new LoncherSDK({
  factoryAddress: '0x236a6B18E30C6073849653cc0f1c46985FD06A8c',
  indexerAddress: '0xb7AB1e21E3A44243361DBa42d8d72213535C083C',
  rpcUrl: 'https://bsc-dataseed.binance.org',
});
```

### Initialize with Signer (For Transactions)

```typescript
import { Wallet, JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('https://bsc-dataseed.binance.org');
const signer = new Wallet('0x...your_private_key', provider);

const sdk = new LoncherSDK({
  factoryAddress: '0x236a6B18E30C6073849653cc0f1c46985FD06A8c',
  indexerAddress: '0xb7AB1e21E3A44243361DBa42d8d72213535C083C',
  signer, // Pass ethers Signer instance
});
```

### Initialize with Browser Wallet (MetaMask)

```typescript
import { BrowserProvider } from 'ethers';

// Get signer from MetaMask
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const sdk = new LoncherSDK({
  factoryAddress: '0x236a6B18E30C6073849653cc0f1c46985FD06A8c',
  indexerAddress: '0xb7AB1e21E3A44243361DBa42d8d72213535C083C',
  signer, // User's wallet signer
});
```

### Initialize with Custom Provider

```typescript
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('https://bsc-dataseed.binance.org');

const sdk = new LoncherSDK({
  factoryAddress: '0x236a6B18E30C6073849653cc0f1c46985FD06A8c',
  indexerAddress: '0xb7AB1e21E3A44243361DBa42d8d72213535C083C',
  provider,
});
```

## Utilities

```typescript
// Verify connected to BSC mainnet
await sdk.verifyNetwork();

// Get current block number
const blockNumber = await sdk.getBlockNumber();

// Get BNB balance
const balance = await sdk.getBNBBalance(address);

// Get signer address
const myAddress = await sdk.getSignerAddress();

// Check if signer is configured
if (sdk.hasSigner()) {
  // Can sign transactions
}

// Get constant addresses
const wbnb = sdk.getWBNBAddress();
const router = sdk.getSwapRouterAddress();

// Cleanup
sdk.disconnect();
```

## Constants

The SDK exports useful constants:

```typescript
import {
  PANCAKE_V3_POSITION_MANAGER,
  PANCAKE_V3_SWAP_ROUTER,
  PANCAKE_V3_FACTORY,
  WBNB_ADDRESS,
  FEE_TIER_10000,
  BSC_CHAIN_ID,
  BSC_TESTNET_CHAIN_ID,
} from '@loncherbnb/sdk';
```

## TypeScript Support

The SDK is written in TypeScript and exports all types:

```typescript
import {
  TokenInfo,
  LiquidityConfig,
  DeployTokenOptions,
  DeployTokenResult,
  FeeCollectionResult,
  TradeEvent,
  TokenCreatedEvent,
  TokenPair,
} from '@loncherbnb/sdk';
```

## Examples

### Deploy Token with Metadata

```typescript
const result = await sdk.factory.deployToken({
  name: 'Super Token',
  symbol: 'SUPER',
  metadata: JSON.stringify({
    description: 'A super cool token',
    image: 'ipfs://...',
    website: 'https://supertoken.io',
    telegram: 'https://t.me/supertoken',
    twitter: 'https://twitter.com/supertoken',
  }),
  configId: 0,
  initialBuyBNB: parseEther('1'), // Buy 1 BNB worth on deploy
});
```

### Monitor All Platform Activity

```typescript
// Listen to all new tokens
sdk.indexer.onTokenCreated((event) => {
  console.log(`New token: ${event.tokenAddress}`);
});

// Listen to all buys
sdk.indexer.onBuy((event) => {
  console.log(`Buy on ${event.token}: ${event.amountTokens}`);
});

// Listen to all sells
sdk.indexer.onSell((event) => {
  console.log(`Sell on ${event.token}: ${event.amountTokens}`);
});
```

### Get Token Statistics

```typescript
const tokenAddress = '0x...';

// Get basic info
const info = await sdk.factory.getTokenInfo(tokenAddress);
console.log('Name:', info.name);
console.log('Symbol:', info.symbol);
console.log('Deployer:', info.deployer);
console.log('Market Cap:', info.marketCapInBNB);

// Get token details
const token = sdk.getToken(tokenAddress);
const totalSupply = await token.totalSupply();
const pair = await token.getTokenPair();

// Get fees
const feesGenerated = await sdk.factory.getTokenFeesGenerated(tokenAddress);
const feesClaimed = await sdk.factory.getTokenFeesClaimed(tokenAddress);
```

### Query Trading History

```typescript
const fromBlock = 12345678;
const tokenAddress = '0x...';

// Get all buys for a token
const buys = await sdk.indexer.queryBuyEvents(fromBlock, 'latest', tokenAddress);
buys.forEach(buy => {
  console.log(`Buyer: ${buy.trader}, Amount: ${buy.amountTokens}`);
});

// Get all sells for a token
const sells = await sdk.indexer.querySellEvents(fromBlock, 'latest', tokenAddress);
sells.forEach(sell => {
  console.log(`Seller: ${sell.trader}, Amount: ${sell.amountTokens}`);
});
```

## Error Handling

```typescript
try {
  const result = await sdk.factory.deployToken({
    name: 'My Token',
    symbol: 'MTK',
    metadata: '{}',
    configId: 0,
  });
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Not enough BNB for gas');
  } else if (error.message.includes('DeploymentDisabled')) {
    console.error('Token deployment is currently disabled');
  } else {
    console.error('Error:', error.message);
  }
}
```

## License

MIT

## Support

For issues and questions:
- GitHub: [https://github.com/LoncherBNB/loncher-sdk/issues](https://github.com/LoncherBNB/loncher-sdk/issues)
- Documentation: See main project README
