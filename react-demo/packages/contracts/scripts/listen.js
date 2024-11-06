const { ethers } = require('ethers');
require('dotenv').config();

const nodeUrl = process.env.NODE_URL;
const adminPrivateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.WORLD_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(nodeUrl);

const contractABI = [
  {"type":"event","name":"endGameEvent","inputs":[{"name":"user","type":"address","indexed":false,"internalType":"address"},{"name":"score","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false}
];

const contract = new ethers.Contract(contractAddress, contractABI, provider);
const wallet = new ethers.Wallet(adminPrivateKey, provider);

contract.on('endGameEvent', async (user, score) => {
  console.log(`Game ended for user: ${user} with score: ${score.toString()}, send ${score.toNumber() / 100} AGLD`);
  const amountToTransfer = ethers.utils.parseUnits((score.toNumber() / 100).toString(), 18);
  try {
    const tx = await wallet.sendTransaction({
      to: user,
      value: amountToTransfer,
    });
    await tx.wait();
    console.log(`Transfer confirmed: ${tx.hash}`);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
});
provider.on('error', (error) => {
  console.error('Provider error:', error);
});
console.log('start listen:', contractAddress);
process.stdin.resume();
