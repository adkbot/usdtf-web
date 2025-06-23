<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>USDTF Transfer</title>
  <link rel="icon" href="/logo.png" type="image/png" />
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
    h2 { color: #333; }
    input, button { font-size: 1rem; padding: 0.5rem; margin: 0.3rem 0; width: 300px; }
    button { background: #4CAF50; color: white; border: none; cursor: pointer; }
    button:hover { background: #45a049; }
    #status { margin-top: 10px; font-weight: bold; }
  </style>
</head>
<body>
  <img src="/logo.png" alt="USDTF Logo" style="width:100px;margin-bottom:10px;"/>
  <h2>Enviar USDTF</h2>
  <p>Contrato: <strong>0xCf32ae001874CB755Ce60Cd32D177bc4EEE0dF2B</strong></p>

  <button onclick="addTokenToWallet()">➕ Adicionar Token à MetaMask</button><br/><br/>

  <label for="to">Carteira Destino:</label><br />
  <input type="text" id="to" placeholder="0x..." /><br />

  <label for="amount">Valor (USDT):</label><br />
  <input type="number" id="amount" placeholder="Ex: 100" /><br />

  <button onclick="sendUSDTF()">🚀 Enviar USDTF</button>

  <p id="status"></p>

  <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
  <script>
    const contractAddress = "0xCf32ae001874CB755Ce60Cd32D177bc4EEE0dF2B";
    const contractABI = [
      {
        "constant": false,
        "inputs": [
          { "name": "to", "type": "address" },
          { "name": "amount", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [ { "name": "", "type": "bool" } ],
        "type": "function"
      }
    ];

    async function sendUSDTF() {
      if (typeof window.ethereum === 'undefined') {
        alert("MetaMask não detectado");
        return;
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0];
      const to = document.getElementById("to").value;
      const amount = document.getElementById("amount").value;

      if (!web3.utils.isAddress(to)) {
        document.getElementById("status").innerText = "❌ Endereço inválido";
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        document.getElementById("status").innerText = "❌ Valor inválido";
        return;
      }

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const amountWithDecimals = web3.utils.toBN(amount * 10 ** 6);

      document.getElementById("status").innerText = "⏳ Enviando...";

      try {
        const tx = await contract.methods.transfer(to, amountWithDecimals).send({ from: sender });
        document.getElementById("status").innerText = "✅ Transferência realizada: " + tx.transactionHash;
      } catch (error) {
        document.getElementById("status").innerText = "❌ Erro: " + error.message;
      }
    }

    async function addTokenToWallet() {
      try {
        await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: contractAddress,
              symbol: 'USDT',
              decimals: 6,
              image: 'https://usdtf-web-6tzb.vercel.app/logo.png'
            }
          }
        });
      } catch (error) {
        alert("Erro ao adicionar token: " + error.message);
      }
    }
  </script>
</body>
</html>
