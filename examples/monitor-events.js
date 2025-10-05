/**
 * Example: Monitor platform events in real-time
 * Run with: node examples/monitor-events.js
 */

const { LoncherSDK } = require('../dist/index.js');
const { formatEther } = require('ethers');

// Configuration
const CONFIG = {
  factoryAddress: '0x...', // Your Factory contract address
  indexerAddress: '0x...', // Your Indexer contract address
  rpcUrl: 'https://bsc-dataseed.binance.org',
};

async function monitorEvents() {
  console.log('Initializing SDK...');
  const sdk = new LoncherSDK(CONFIG);

  const blockNumber = await sdk.getBlockNumber();
  console.log(`Starting from block: ${blockNumber}`);
  console.log('\nMonitoring events... (Press Ctrl+C to stop)\n');

  // Listen for new token deployments
  sdk.indexer.onTokenCreated((event) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 NEW TOKEN DEPLOYED');
    console.log(`   Address: ${event.tokenAddress}`);
    console.log(`   Deployer: ${event.deployer}`);
    console.log(`   Block: ${event.blockNumber}`);
    console.log(`   TX: ${event.transactionHash}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // Listen for buy events
  sdk.indexer.onBuy((event) => {
    console.log('📈 BUY');
    console.log(`   Token: ${event.token}`);
    console.log(`   Buyer: ${event.trader}`);
    console.log(`   Amount: ${formatEther(event.amountTokens)}`);
    console.log(`   Pool: ${event.pool}`);
    console.log(`   Block: ${event.blockNumber}\n`);
  });

  // Listen for sell events
  sdk.indexer.onSell((event) => {
    console.log('📉 SELL');
    console.log(`   Token: ${event.token}`);
    console.log(`   Seller: ${event.trader}`);
    console.log(`   Amount: ${formatEther(event.amountTokens)}`);
    console.log(`   Pool: ${event.pool}`);
    console.log(`   Block: ${event.blockNumber}\n`);
  });

  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n\nStopping event monitor...');
    sdk.disconnect();
    process.exit(0);
  });
}

monitorEvents().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
