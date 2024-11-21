import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { ERC20_ABI } from '../constants/contractABI';

interface Token {
  address: string;
  token: string;
  symbol: string;
  decimals: number;
  balance: string;
}

export function useTokens(address: string | null, network: string | null) {
  return useQuery({
    queryKey: ['tokens', address, network],
    queryFn: async (): Promise<Token[]> => {
      if (!address || !network) {
        return [];
      }

      try {
        const response = await fetch('/.netlify/functions/getTokenBalances', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address, network }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === '0') {
          throw new Error(data.message || 'Failed to fetch token balances');
        }

        // Process and deduplicate tokens
        const tokenMap = new Map<string, Token>();
        
        for (const tx of data.result) {
          const address = tx.contractAddress;
          if (!tokenMap.has(address)) {
            tokenMap.set(address, {
              address,
              token: tx.tokenName,
              symbol: tx.tokenSymbol,
              decimals: parseInt(tx.tokenDecimal),
              balance: ethers.utils.formatUnits(tx.value, tx.tokenDecimal)
            });
          }
        }

        return Array.from(tokenMap.values());
      } catch (error: any) {
        throw new Error(`Failed to fetch token balances: ${error.message}`);
      }
    },
    enabled: !!address && !!network,
  });
}

export async function transferTokens(
  tokenAddress: string,
  from: string,
  to: string,
  amount: string,
  decimals: number
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

  const tx = await contract.transfer(
    to,
    ethers.utils.parseUnits(amount, decimals)
  );

  return tx.wait();
}