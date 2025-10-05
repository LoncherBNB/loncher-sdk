/**
 * Example: Deploy a new token with initial buy
 * Run with: PRIVATE_KEY=0x... node examples/deploy-token.js
 */

const { LoncherSDK } = require('../dist/index.js');
const { parseEther, formatEther } = require('ethers');

// Configuration
const CONFIG = {
  factoryAddress: '0x...', // Your Factory contract address
  indexerAddress: '0x...', // Your Indexer contract address
  rpcUrl: 'https://bsc-dataseed.binance.org',
  privateKey: process.env.PRIVATE_KEY,
};

// Token configuration
const TOKEN_CONFIG = {
  name: 'My Awesome Token',
  symbol: 'MAT',
  metadata: JSON.stringify({
    description: 'An awesome token for the community',
    image: 'https://example.com/token.png',
    website: 'https://example.com',
    telegram: 'https://t.me/myawesometoken',
    twitter: 'https://twitter.com/myawesometoken',
  }),
  configId: 0, // Use default liquidity config
  initialBuyBNB: parseEther('0.1'), // Buy 0.1 BNB worth on deploy
};

async function deployToken() {
  if (!CONFIG.privateKey) {
    console.error('Error: PRIVATE_KEY environment variable not set');
    console.log('Usage: PRIVATE_KEY=0x... node examples/deploy-token.js');
    process.exit(1);
  }

  console.log('Initializing SDK...');
  const sdk = new LoncherSDK(CONFIG);

  const signerAddress = await sdk.getSignerAddress();
  console.log(`Deploying from: ${signerAddress}`);

  const balance = await sdk.getBNBBalance(signerAddress);
  console.log(`BNB Balance: ${formatEther(balance)}\n`);

  console.log('Token Configuration:');
  console.log(`  Name: ${TOKEN_CONFIG.name}`);
  console.log(`  Symbol: ${TOKEN_CONFIG.symbol}`);
  console.log(`  Initial Buy: ${formatEther(TOKEN_CONFIG.initialBuyBNB)} BNB\n`);

  console.log('Deploying token...');
  const result = await sdk.factory.deployToken(TOKEN_CONFIG);

  console.log('\n✅ Token Deployed Successfully!');
  console.log(`Token Address: ${result.tokenAddress}`);
  console.log(`Transaction Hash: ${result.transactionHash}`);
  console.log(`Tokens Received: ${formatEther(result.tokensReceived)}`);

  // Get token details
  console.log('\nFetching token details...');
  const tokenInfo = await sdk.factory.getTokenInfo(result.tokenAddress);
  const token = sdk.getToken(result.tokenAddress);
  const totalSupply = await token.totalSupply();
  const myBalance = await token.balanceOf(signerAddress);

  console.log('\nToken Details:');
  console.log(`  Name: ${tokenInfo.name}`);
  console.log(`  Symbol: ${tokenInfo.symbol}`);
  console.log(`  Total Supply: ${formatEther(totalSupply)}`);
  console.log(`  Market Cap: ${formatEther(tokenInfo.marketCapInBNB)} BNB`);
  console.log(`  Your Balance: ${formatEther(myBalance)}`);

  // Get pool info
  const pair = await token.getTokenPair();
  console.log(`  Pool Address: ${pair.pool}`);

  sdk.disconnect();
}

deployToken().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
