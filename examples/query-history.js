/**
 * Example: Query historical trading data
 * Run with: node examples/query-history.js
 */

const { LoncherSDK } = require('../dist/index.js');
const { formatEther } = require('ethers');

// Configuration
const CONFIG = {
  factoryAddress: '0x...', // Your Factory contract address
  indexerAddress: '0x...', // Your Indexer contract address
  rpcUrl: 'https://bsc-dataseed.binance.org',
};

// Query configuration
const FROM_BLOCK = 12345678; // Starting block number
const TOKEN_ADDRESS = '0x...'; // Specific token to query (optional)

async function queryHistory() {
  console.log('Initializing SDK...');
  const sdk = new LoncherSDK(CONFIG);

  const currentBlock = await sdk.getBlockNumber();
  console.log(`Current block: ${currentBlock}`);
  console.log(`Querying from block ${FROM_BLOCK} to ${currentBlock}\n`);

  // Query token creation events
  console.log('=== Token Creation Events ===');
  const tokenCreatedEvents = await sdk.indexer.queryTokenCreated(FROM_BLOCK);
  console.log(`Found ${tokenCreatedEvents.length} tokens\n`);

  tokenCreatedEvents.slice(0, 5).forEach((event, i) => {
    console.log(`${i + 1}. ${event.tokenAddress}`);
    console.log(`   Deployer: ${event.deployer}`);
    console.log(`   Block: ${event.blockNumber}`);
    console.log(`   Time: ${new Date(Number(event.timestamp) * 1000).toLocaleString()}\n`);
  });

  // Query buy events for a specific token
  if (TOKEN_ADDRESS && TOKEN_ADDRESS !== '0x...') {
    console.log(`\n=== Buy Events for ${TOKEN_ADDRESS} ===`);
    const buyEvents = await sdk.indexer.queryBuyEvents(FROM_BLOCK, 'latest', TOKEN_ADDRESS);
    console.log(`Found ${buyEvents.length} buys\n`);

    buyEvents.slice(0, 10).forEach((event, i) => {
      console.log(`${i + 1}. ${formatEther(event.amountTokens)} tokens`);
      console.log(`   Buyer: ${event.trader}`);
      console.log(`   Block: ${event.blockNumber}`);
      console.log(`   TX: ${event.transactionHash}\n`);
    });

    // Query sell events for the same token
    console.log(`\n=== Sell Events for ${TOKEN_ADDRESS} ===`);
    const sellEvents = await sdk.indexer.querySellEvents(FROM_BLOCK, 'latest', TOKEN_ADDRESS);
    console.log(`Found ${sellEvents.length} sells\n`);

    sellEvents.slice(0, 10).forEach((event, i) => {
      console.log(`${i + 1}. ${formatEther(event.amountTokens)} tokens`);
      console.log(`   Seller: ${event.trader}`);
      console.log(`   Block: ${event.blockNumber}`);
      console.log(`   TX: ${event.transactionHash}\n`);
    });

    // Calculate statistics
    const totalBuyVolume = buyEvents.reduce((sum, e) => sum + e.amountTokens, 0n);
    const totalSellVolume = sellEvents.reduce((sum, e) => sum + e.amountTokens, 0n);

    console.log('\n=== Statistics ===');
    console.log(`Total Buys: ${buyEvents.length}`);
    console.log(`Total Sells: ${sellEvents.length}`);
    console.log(`Total Buy Volume: ${formatEther(totalBuyVolume)} tokens`);
    console.log(`Total Sell Volume: ${formatEther(totalSellVolume)} tokens`);
  } else {
    console.log('\nTo query specific token events, set TOKEN_ADDRESS in the script.');
  }

  sdk.disconnect();
}

queryHistory().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
