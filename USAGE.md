# Loncher SDK - Quick Usage Guide

## Installation

```bash
cd loncher-sdk
npm install
npm run build
```

## Basic Setup

```javascript
const { LoncherSDK } = require('./dist/index.js');
const { parseEther, formatEther, Wallet, JsonRpcProvider } = require('ethers');

// For read-only operations
const sdk = new LoncherSDK({
  factoryAddress: '0x236a6B18E30C6073849653cc0f1c46985FD06A8c',
  indexerAddress: '0xb7AB1e21E3A44243361DBa42d8d72213535C083C',
  rpcUrl: 'https://bsc-dataseed.binance.org',
});

// For transactions (with signer)
const provider = new JsonRpcProvider('https://bsc-dataseed.binance.org');
const signer = new Wallet('0x...your_private_key', provider);

const sdkWithSigner = new LoncherSDK({
  factoryAddress: '0x236a6B18E30C6073849653cc0f1c46985FD06A8c',
  indexerAddress: '0xb7AB1e21E3A44243361DBa42d8d72213535C083C',
  signer,
});
```

## Common Tasks

### 1. Deploy a Token

```javascript
const result = await sdk.factory.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  metadata: JSON.stringify({
    description: 'Token description',
    image: 'https://...',
  }),
  configId: 0,
  initialBuyBNB: parseEther('0.1'), // Optional initial buy
});

console.log('Token:', result.tokenAddress);
console.log('TX:', result.transactionHash);
```

### 2. Get Token Info

```javascript
// Get basic info
const info = await sdk.factory.getTokenInfo(tokenAddress);
console.log('Name:', info.name);
console.log('Market Cap:', formatEther(info.marketCapInBNB), 'BNB');

// Interact with token
const token = sdk.getToken(tokenAddress);
const balance = await token.balanceOf(myAddress);
const totalSupply = await token.totalSupply();
```

### 3. Monitor Events

```javascript
// Listen for new tokens
sdk.indexer.onTokenCreated((event) => {
  console.log('New token:', event.tokenAddress);
});

// Listen for trades
sdk.indexer.onBuy((event) => {
  console.log('Buy:', formatEther(event.amountTokens));
});

sdk.indexer.onSell((event) => {
  console.log('Sell:', formatEther(event.amountTokens));
});
```

### 4. Query History

```javascript
const fromBlock = 12345678;

// Get all tokens created
const tokens = await sdk.indexer.queryTokenCreated(fromBlock);

// Get trades for specific token
const buys = await sdk.indexer.queryBuyEvents(fromBlock, 'latest', tokenAddress);
const sells = await sdk.indexer.querySellEvents(fromBlock, 'latest', tokenAddress);
```

## Examples

Run the example scripts:

```bash
# Basic usage
node examples/basic-usage.js

# Deploy a token
PRIVATE_KEY=0x... node examples/deploy-token.js

# Monitor events
node examples/monitor-events.js

# Query trading history
node examples/query-history.js
```

## Integration with Frontend

Use the SDK in your Nuxt/Vue frontend:

```bash
# In your frontend project
npm install loncher-sdk ethers@6
```

```javascript
// In your Vue component or composable
import { LoncherSDK } from 'loncher-sdk';
import { BrowserProvider } from 'ethers';

// Use with MetaMask/wallet
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const sdk = new LoncherSDK({
  factoryAddress: '0x236a6B18E30C6073849653cc0f1c46985FD06A8c',
  indexerAddress: '0xb7AB1e21E3A44243361DBa42d8d72213535C083C',
  signer, // User's wallet signer
});

// Deploy token from user's wallet
const result = await sdk.factory.deployToken({
  name: formData.name,
  symbol: formData.symbol,
  metadata: JSON.stringify(formData.metadata),
  initialBuyBNB: parseEther(formData.buyAmount),
});
```

## TypeScript Support

The SDK includes full TypeScript definitions:

```typescript
import { LoncherSDK, TokenInfo, DeployTokenResult } from 'loncher-sdk';

const sdk = new LoncherSDK({ ... });

const info: TokenInfo = await sdk.factory.getTokenInfo(address);
const result: DeployTokenResult = await sdk.factory.deployToken({ ... });
```

## Available Classes

- `LoncherSDK` - Main SDK class
- `Factory` - Token factory contract wrapper
- `Token` - ERC20 token contract wrapper
- `Indexer` - Event indexer contract wrapper

## Available Types

- `TokenInfo` - Token information
- `LiquidityConfig` - Liquidity configuration
- `DeployTokenOptions` - Token deployment options
- `DeployTokenResult` - Token deployment result
- `FeeCollectionResult` - Fee collection result
- `TradeEvent` - Buy/sell event data
- `TokenCreatedEvent` - Token creation event data
- `TokenPair` - Token pair information

## Constants

```javascript
import {
  WBNB_ADDRESS,
  PANCAKE_V3_SWAP_ROUTER,
  PANCAKE_V3_POSITION_MANAGER,
  PANCAKE_V3_FACTORY,
  FEE_TIER_10000,
  BSC_CHAIN_ID,
} from 'loncher-sdk';
```
