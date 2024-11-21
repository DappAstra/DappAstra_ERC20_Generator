import { ethers } from 'ethers';
import { toast } from './toastManager';
import { ERC20_ABI, ERC20_BYTECODE } from '../constants/contractABI';

export type Network = {
  name: string;
  chainId: number;
  rpcUrl: string;
  currencySymbol: string;
  blockExplorer: string;
};

export const SUPPORTED_NETWORKS: { [key: string]: Network } = {
  ethereum: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/your-project-id',
    currencySymbol: 'ETH',
    blockExplorer: 'https://etherscan.io'
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    currencySymbol: 'MATIC',
    blockExplorer: 'https://polygonscan.com'
  },
  bsc: {
    name: 'BNB Smart Chain',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    currencySymbol: 'BNB',
    blockExplorer: 'https://bscscan.com'
  },
  arbitrum: {
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    currencySymbol: 'ETH',
    blockExplorer: 'https://arbiscan.io'
  }
};

class Web3Handler {
  private provider: ethers.providers.Web3Provider | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  isConnected(): boolean {
    return this.provider !== null;
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) {
      throw new Error('Please install MetaMask to use this feature');
    }

    try {
      const accounts = await this.provider.send('eth_requestAccounts', []);
      return accounts[0];
    } catch (error: any) {
      throw new Error('Failed to connect wallet: ' + error.message);
    }
  }

  async switchNetwork(networkKey: string): Promise<void> {
    if (!this.provider) {
      throw new Error('Please install MetaMask to use this feature');
    }

    const network = SUPPORTED_NETWORKS[networkKey];
    if (!network) {
      throw new Error('Unsupported network');
    }

    try {
      await this.provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${network.chainId.toString(16)}` }
      ]);
    } catch (error: any) {
      if (error.code === 4902) {
        await this.provider.send('wallet_addEthereumChain', [
          {
            chainId: `0x${network.chainId.toString(16)}`,
            chainName: network.name,
            nativeCurrency: {
              name: network.currencySymbol,
              symbol: network.currencySymbol,
              decimals: 18
            },
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.blockExplorer]
          }
        ]);
      } else {
        throw new Error('Failed to switch network: ' + error.message);
      }
    }
  }

  async estimateGas(config: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    owner: string;
  }): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const factory = new ethers.ContractFactory(
      ERC20_ABI,
      ERC20_BYTECODE,
      this.provider.getSigner()
    );

    try {
      const deploymentTx = await factory.getDeployTransaction(
        config.decimals,
        config.symbol,
        config.name,
        ethers.utils.parseUnits(config.totalSupply, config.decimals)
      );

      const gasEstimate = await this.provider.estimateGas(deploymentTx);
      return gasEstimate.toString();
    } catch (error: any) {
      throw new Error('Failed to estimate gas: ' + error.message);
    }
  }

  async deployToken(config: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    owner: string;
  }): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const factory = new ethers.ContractFactory(
      ERC20_ABI,
      ERC20_BYTECODE,
      this.provider.getSigner()
    );

    try {
      const contract = await factory.deploy(
        config.decimals,
        config.symbol,
        config.name,
        ethers.utils.parseUnits(config.totalSupply, config.decimals)
      );

      await contract.deployed();
      return contract.address;
    } catch (error: any) {
      throw new Error('Failed to deploy token: ' + error.message);
    }
  }
}

export const web3Handler = new Web3Handler();