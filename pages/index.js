import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../presaleABI.json";

const PRESALE_ADDRESS = "0xC4259173a89D280385F5421dC9dB0B1ff11Fe6b1";
const USDC_ADDRESS = "0xd9AA94FF7C3B5FB3f36473C55504FF63f204A4D8";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [presale, setPresale] = useState(null);
  const [usdc, setUSDC] = useState(null);
  const [txStatus, setTxStatus] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (wallet && provider) {
      const signer = provider.getSigner();
      setPresale(new ethers.Contract(PRESALE_ADDRESS, abi, signer));
      setUSDC(new ethers.Contract(USDC_ADDRESS, [
        "function approve(address spender, uint256 amount) public returns (bool)"
      ], signer));
    }
  }, [wallet, provider]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const _provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await _provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);
    setProvider(_provider);
  };

  const approveUSDC = async () => {
    try {
      setTxStatus("Approving USDC...");
      const tx = await usdc.approve(PRESALE_ADDRESS, ethers.parseUnits("5", 6));
      await tx.wait();
      setTxStatus("✅ USDC Approved!");
      setIsApproved(true);
    } catch (err) {
      setTxStatus("❌ Approval failed.");
    }
  };

  const buyWithETH = async () => {
    try {
      setTxStatus("Buying with ETH...");
      const tx = await presale.buyWithETH({ value: ethers.parseEther("0.01") });
      await tx.wait();
      setTxStatus("✅ ETH Purchase successful!");
    } catch (err) {
      setTxStatus("❌ ETH Transaction failed.");
    }
  };

  const buyWithUSDC = async () => {
    try {
      if (!isApproved) return alert("Approve USDC first.");
      setTxStatus("Buying with USDC...");
      const tx = await presale.buyWithUSDC();
      await tx.wait();
      setTxStatus("✅ USDC Purchase successful!");
    } catch (err) {
      setTxStatus("❌ USDC Transaction failed.");
    }
  };

  const claimTokens = async () => {
    try {
      setTxStatus("Claiming tokens...");
      const tx = await presale.claimTokens();
      await tx.wait();
      setTxStatus("✅ Claim successful!");
    } catch (err) {
      setTxStatus("❌ Claim failed.");
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'gold', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
      <img src="/token.png" alt="$TWY" style={{ width: 180, marginBottom: '1.5rem' }} />
      <h1>$TWY Web3 Empire</h1>
      <p>Presale Pricing: Tier 1 = 0.002 USDC, Tier 2 = 0.004, Tier 3 = 0.005</p>
      <button onClick={connectWallet} style={{ padding: '12px 24px', marginTop: '1.5rem' }}>Connect Wallet</button>
      {wallet && (
        <>
          <p style={{ marginTop: '1rem' }}>Connected: {wallet}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={buyWithETH} style={{ padding: '12px 24px' }}>Buy with ETH</button>
            <button onClick={approveUSDC} style={{ padding: '12px 24px' }}>Approve USDC</button>
            <button onClick={buyWithUSDC} style={{ padding: '12px 24px' }}>Buy with USDC</button>
          </div>
          <button onClick={claimTokens} style={{ marginTop: '2rem', padding: '12px 24px' }}>Claim Tokens</button>
        </>
      )}
      <p style={{ marginTop: '1rem', color: 'white' }}>{txStatus}</p>
    </div>
  );
}
