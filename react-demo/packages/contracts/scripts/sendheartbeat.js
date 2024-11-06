require('dotenv').config();

const nodeUrl = process.env.NODE_URL;
const adminPrivateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.WORLD_ADDRESS;
const isStart = true
const interval = 10000

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_manageContractTask',
    params: [
      contractAddress,
      adminPrivateKey.slice(2),
      interval,
      isStart
    ],
    id: 1
  })
};

fetch(nodeUrl, options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
