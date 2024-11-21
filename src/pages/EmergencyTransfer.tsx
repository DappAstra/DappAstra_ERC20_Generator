import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useTokens, transferTokens } from '../hooks/useTokens';
import { toast } from '../utils/toastManager';
import { AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import Tooltip from '../components/Tooltip';
import { SUPPORTED_NETWORKS } from '../utils/web3Handlers';

interface TransferProgress {
  [key: string]: 'pending' | 'success' | 'error';
}

export default function EmergencyTransfer() {
  const { account, currentNetwork, connectWallet, isConnected } = useWeb3();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [transferProgress, setTransferProgress] = useState<TransferProgress>({});

  const { data: tokens, isLoading, error } = useTokens(account, currentNetwork);

  // Handle error toast in useEffect to avoid setState during render
  useEffect(() => {
    if (error) {
      toast('error', error.message);
    }
  }, [error]);

  const handleTransfer = async () => {
    if (!destinationAddress) {
      toast('error', 'Please enter a destination wallet address');
      return;
    }

    if (selectedTokens.length === 0) {
      toast('error', 'Please select at least one token to transfer');
      return;
    }

    for (const tokenAddress of selectedTokens) {
      const token = tokens?.find(t => t.address === tokenAddress);
      if (!token) continue;

      setTransferProgress(prev => ({ ...prev, [tokenAddress]: 'pending' }));

      try {
        await transferTokens(
          token.address,
          account!,
          destinationAddress,
          token.balance,
          token.decimals
        );

        setTransferProgress(prev => ({ ...prev, [tokenAddress]: 'success' }));
        toast('success', `Successfully transferred ${token.symbol}`);
      } catch (error: any) {
        setTransferProgress(prev => ({ ...prev, [tokenAddress]: 'error' }));
        toast('error', `Failed to transfer ${token.symbol}: ${error.message}`);
      }
    }
  };

  const toggleTokenSelection = (address: string) => {
    setSelectedTokens(prev => 
      prev.includes(address)
        ? prev.filter(a => a !== address)
        : [...prev, address]
    );
  };

  const getExplorerUrl = (address: string) => {
    const network = SUPPORTED_NETWORKS[currentNetwork || 'ethereum'];
    return `${network.blockExplorer}/token/${address}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Emergency Token Transfer Tool
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Quickly transfer all ERC-20 tokens from one wallet to another
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          {/* Wallet Connection */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentNetwork && (
                <span className="flex items-center gap-2">
                  Network: {SUPPORTED_NETWORKS[currentNetwork].name}
                </span>
              )}
            </div>
            <button
              onClick={connectWallet}
              className={`flex items-center gap-2 px-4 py-2 ${
                isConnected 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white rounded-lg transition-colors`}
            >
              {isConnected ? account!.slice(0, 6) + '...' + account!.slice(-4) : 'Connect Wallet'}
            </button>
          </div>

          {isConnected ? (
            <>
              {/* Token List */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Tokens</h3>
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      Loading tokens...
                    </div>
                  ) : tokens?.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      No tokens found in this wallet
                    </div>
                  ) : (
                    tokens?.map((token) => (
                      <div
                        key={token.address}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedTokens.includes(token.address)}
                            onChange={() => toggleTokenSelection(token.address)}
                            className="rounded text-indigo-600"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 dark:text-white">{token.token}</p>
                              <a
                                href={getExplorerUrl(token.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-700"
                              >
                                <ExternalLink size={16} />
                              </a>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Balance: {token.balance} {token.symbol}
                            </p>
                          </div>
                        </div>
                        {transferProgress[token.address] && (
                          <div className={`text-sm ${
                            transferProgress[token.address] === 'success' 
                              ? 'text-green-600' 
                              : transferProgress[token.address] === 'error'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                          }`}>
                            {transferProgress[token.address] === 'success' 
                              ? 'Transferred'
                              : transferProgress[token.address] === 'error'
                                ? 'Failed'
                                : 'Pending...'}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Destination Address */}
              {tokens && tokens.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                    Destination Wallet Address
                    <Tooltip 
                      content="Enter the wallet address that will receive the tokens"
                      link="https://ethereum.org/en/wallets/"
                    />
                  </label>
                  <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                  />
                </div>
              )}

              {/* Transfer Button */}
              {tokens && tokens.length > 0 && selectedTokens.length > 0 && (
                <button
                  onClick={handleTransfer}
                  className="w-full mt-6 py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight size={20} />
                  Transfer Selected Tokens
                </button>
              )}

              {/* Warning Message */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle size={20} />
                  <p className="text-sm">
                    Make sure you have enough native tokens ({SUPPORTED_NETWORKS[currentNetwork || 'ethereum'].currencySymbol}) in your wallet to cover gas fees for the transfers.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              Please connect your wallet to view and transfer tokens
            </div>
          )}
        </div>
      </div>
    </div>
  );
}