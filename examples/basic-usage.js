/**
 * Basic usage examples for Loncher SDK
 * Run with: node examples/basic-usage.js
 */

const { LoncherSDK } = require('../dist/index.js');
const { parseEther, formatEther } = require('ethers');

// Configuration (replace with your actual values)
const CONFIG = {
  factoryAddress: '0x...', // Your Factory contract address
  indexerAddress: '0x...', // Your Indexer contract address
  rpcUrl: 'https://bsc-dataseed.binance.org',
  privateKey: process.env.PRIVATE_KEY, // Optional: set via environment variable
};

async function main() {
  // Initialize SDK
  console.log('Initializing Loncher SDK...');
  const sdk = new LoncherSDK(CONFIG);

  // Verify network
  const chainId = await sdk.getChainId();
  console.log(`Connected to chain ID: ${chainId}`);

  const blockNumber = await sdk.getBlockNumber();
  console.log(`Current block: ${blockNumber}\n`);

  // Example 1: Get platform statistics
  console.log('=== Platform Statistics ===');
  const tokenCount = await sdk.factory.getTokenCount();
  console.log(`Total tokens deployed: ${tokenCount}`);

  const deployCoinEnabled = await sdk.factory.isDeployCoinEnabled();
  console.log(`Deployment enabled: ${deployCoinEnabled}\n`);

  // Example 2: Get recent tokens
  console.log('=== Recent Tokens (Page 0) ===');
  const recentTokens = await sdk.factory.getDeploysByPage(0, 0);
  recentTokens.slice(0, 3).forEach((token, i) => {
    console.log(`${i + 1}. ${token.name} (${token.symbol})`);
    console.log(`   Address: ${token.tokenAddress}`);
    console.log(`   Deployer: ${token.deployer}`);
    console.log(`   Market Cap: ${formatEther(token.marketCapInBNB)} BNB\n`);
  });

  // Example 3: Get token details
  if (recentTokens.length > 0) {
    const firstToken = recentTokens[0];
    console.log(`=== Token Details: ${firstToken.name} ===`);

    const token = sdk.getToken(firstToken.tokenAddress);
    const totalSupply = await token.totalSupply();
    const pair = await token.getTokenPair();
    const isLaunchActive = await token.isLaunchPeriodActive();

    console.log(`Total Supply: ${formatEther(totalSupply)}`);
    console.log(`Pool: ${pair.pool}`);
    console.log(`Launch Period Active: ${isLaunchActive}\n`);
  }

  // Example 4: Deploy a new token (requires signer)
  if (sdk.hasSigner()) {
    console.log('=== Deploying New Token ===');
    try {
      const result = await sdk.factory.deployToken({
        name: 'Test Token',
        symbol: 'TEST',
        metadata: JSON.stringify({
          description: 'A test token',
          website: 'https://example.com',
        }),
        configId: 0,
        initialBuyBNB: parseEther('0.01'), // Buy 0.01 BNB worth
      });

      console.log(`Token deployed: ${result.tokenAddress}`);
      console.log(`Transaction: ${result.transactionHash}`);
      console.log(`Tokens received: ${formatEther(result.tokensReceived)}\n`);
    } catch (error) {
      console.error('Deployment failed:', error.message);
    }
  } else {
    console.log('=== Token Deployment ===');
    console.log('Skipped (no signer configured)\n');
  }

  // Example 5: Listen to events (run for 30 seconds)
  console.log('=== Listening to Events (30s) ===');

  sdk.indexer.onTokenCreated((event) => {
    console.log(`[NEW TOKEN] ${event.tokenAddress}`);
    console.log(`  Deployer: ${event.deployer}`);
  });

  sdk.indexer.onBuy((event) => {
    console.log(`[BUY] Token: ${event.token}`);
    console.log(`  Amount: ${formatEther(event.amountTokens)}`);
    console.log(`  Buyer: ${event.trader}`);
  });

  sdk.indexer.onSell((event) => {
    console.log(`[SELL] Token: ${event.token}`);
    console.log(`  Amount: ${formatEther(event.amountTokens)}`);
    console.log(`  Seller: ${event.trader}`);
  });

  // Wait for 30 seconds
  await new Promise(resolve => setTimeout(resolve, 30000));

  // Cleanup
  sdk.disconnect();
  console.log('\nDisconnected.');
}

// Run the examples
main().catch(console.error);
