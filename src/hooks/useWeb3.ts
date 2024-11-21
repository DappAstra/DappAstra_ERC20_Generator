import { useEffect, useState } from 'react';
import { web3Handler, SUPPORTED_NETWORKS } from '../utils/web3Handlers';
import { toast } from '../utils/toastManager';

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          toast('info', 'Wallet disconnected');
        } else {
          setAccount(accounts[0]);
          toast('success', 'Account connected successfully');
        }
      };

      const handleChainChanged = (chainId: string) => {
        const chainIdNum = parseInt(chainId, 16);
        const network = Object.entries(SUPPORTED_NETWORKS).find(
          ([_, network]) => network.chainId === chainIdNum
        );
        
        setCurrentNetwork(network ? network[0] : 'other');
        toast('success', `Network changed to ${network ? network[1].name : 'Unknown Network'}`);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      if (web3Handler.isConnected()) {
        window.ethereum.request({ method: 'eth_accounts' })
          .then(handleAccountsChanged)
          .catch(console.error);

        window.ethereum.request({ method: 'eth_chainId' })
          .then(handleChainChanged)
          .catch(console.error);
      }

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Rest of the file remains exactly the same
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const address = await web3Handler.connectWallet();
      setAccount(address);
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdNum = parseInt(chainId, 16);
      const network = Object.entries(SUPPORTED_NETWORKS).find(
        ([_, network]) => network.chainId === chainIdNum
      );
      
      setCurrentNetwork(network ? network[0] : 'other');
      toast('success', 'Wallet connected successfully');
    } catch (error: any) {
      toast('error', error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (networkKey: string) => {
    if (networkKey === 'other') return;
    
    try {
      await web3Handler.switchNetwork(networkKey);
      setCurrentNetwork(networkKey);
      toast('success', `Switched to ${SUPPORTED_NETWORKS[networkKey].name}`);
    } catch (error: any) {
      toast('error', error.message);
    }
  };

  const deployToken = async (config: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
  }) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    try {
      const estimatedGas = await web3Handler.estimateGas({
        ...config,
        owner: account
      });

      const tokenAddress = await web3Handler.deployToken({
        ...config,
        owner: account
      });

      return {
        address: tokenAddress,
        estimatedGas
      };
    } catch (error: any) {
      throw new Error(`Failed to deploy token: ${error.message}`);
    }
  };

  return {
    account,
    isConnecting,
    currentNetwork,
    connectWallet,
    switchNetwork,
    deployToken,
    isConnected: !!account
  };
}