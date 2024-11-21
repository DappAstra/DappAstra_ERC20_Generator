import React, { useState } from 'react';
import { Shield, HelpCircle, AlertCircle } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';
import { validateTokenName, validateTokenSymbol, validateSupply, validateDecimals } from '../utils/validation';
import { SUPPORTED_NETWORKS } from '../utils/web3Handlers';
import { toast } from '../utils/toastManager';
import Tooltip from './Tooltip';

interface FormData {
  name: string;
  symbol: string;
  supply: string;
  decimals: string;
}

export default function TokenForm() {
  const { account, currentNetwork, connectWallet, switchNetwork, deployToken, isConnected } = useWeb3();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    symbol: '',
    supply: '',
    decimals: '18'
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isDeploying, setIsDeploying] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    const nameError = validateTokenName(formData.name);
    if (nameError) newErrors.name = nameError;

    const symbolError = validateTokenSymbol(formData.symbol);
    if (symbolError) newErrors.symbol = symbolError;

    const supplyError = validateSupply(formData.supply);
    if (supplyError) newErrors.supply = supplyError;

    const decimalsError = validateDecimals(formData.decimals);
    if (decimalsError) newErrors.decimals = decimalsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast('error', 'Please connect your wallet first');
      return;
    }

    if (!validateForm()) {
      toast('error', 'Please fix the form errors before submitting');
      return;
    }

    try {
      setIsDeploying(true);
      const result = await deployToken({
        name: formData.name,
        symbol: formData.symbol,
        decimals: parseInt(formData.decimals),
        totalSupply: formData.supply
      });

      toast('success', `Token deployed successfully! Contract address: ${result.address}`);
      
      setFormData({
        name: '',
        symbol: '',
        supply: '',
        decimals: '18'
      });
    } catch (error: any) {
      toast('error', error.message);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 transition-colors">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Your Token</h2>
          <p className="text-gray-600 dark:text-gray-300">Deploy your ERC-20 token in minutes</p>
        </div>
        <button
          onClick={connectWallet}
          className={`flex items-center gap-2 px-4 py-2 ${
            isConnected 
              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700' 
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
          } text-white rounded-lg transition-colors`}
        >
          {isConnected ? formatAddress(account!) : 'Connect Wallet'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Name Field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              Token Name
              <Tooltip 
                content={
                  <div>
                    <p>The full name of your token (e.g., "Ethereum", "USD Coin"). This should be:</p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>Clear and descriptive</li>
                      <li>Easy to understand</li>
                      <li>Unique to avoid confusion</li>
                    </ul>
                  </div>
                }
                link="https://ethereum.org/en/developers/docs/standards/tokens/erc-20/"
              />
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              }`}
              placeholder="e.g., My Token"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              Token Symbol
              <Tooltip 
                content={
                  <div>
                    <p>A short identifier for your token (e.g., "ETH", "USDC"). Your symbol should be:</p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>2-5 characters long</li>
                      <li>All capital letters</li>
                      <li>No special characters (except maybe $)</li>
                    </ul>
                  </div>
                }
                link="https://ethereum.org/en/developers/docs/standards/tokens/erc-20/"
              />
            </label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white ${
                errors.symbol ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              }`}
              placeholder="e.g., MTK"
              required
            />
            {errors.symbol && (
              <p className="mt-1 text-sm text-red-500">{errors.symbol}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              Initial Supply
              <Tooltip 
                content={
                  <div>
                    <p>The total number of tokens to create at launch. Consider:</p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>This number will be multiplied by 10^decimals</li>
                      <li>Can be increased later if minting is enabled</li>
                      <li>Common supplies range from millions to billions</li>
                    </ul>
                  </div>
                }
                link="https://ethereum.org/en/developers/tutorials/understand-the-erc-20-token-smart-contract/"
              />
            </label>
            <input
              type="number"
              name="supply"
              value={formData.supply}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white ${
                errors.supply ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              }`}
              placeholder="e.g., 1000000"
              required
            />
            {errors.supply && (
              <p className="mt-1 text-sm text-red-500">{errors.supply}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              Decimals
              <Tooltip 
                content={
                  <div>
                    <p>The number of decimal places your token can be divided into:</p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>Standard is 18 (same as ETH)</li>
                      <li>Cannot be changed after deployment</li>
                      <li>Affects token divisibility, not total supply</li>
                    </ul>
                  </div>
                }
                link="https://ethereum.org/en/developers/docs/standards/tokens/erc-20/"
              />
            </label>
            <input
              type="number"
              name="decimals"
              value={formData.decimals}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white ${
                errors.decimals ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              }`}
              placeholder="18"
              min="0"
              max="18"
              required
            />
            {errors.decimals && (
              <p className="mt-1 text-sm text-red-500">{errors.decimals}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            Network
            <Tooltip 
              content={
                <div>
                  <p>The blockchain network where your token will be deployed:</p>
                  <ul className="list-disc ml-4 mt-2">
                    <li>Ethereum: Main network, highest security, highest fees</li>
                    <li>Polygon: Fast & cheap transactions, good for testing</li>
                    <li>BSC: Popular for DeFi, lower fees</li>
                    <li>Arbitrum: Ethereum L2, faster & cheaper than mainnet</li>
                  </ul>
                  <p className="mt-2 text-yellow-500">
                    Note: For networks not listed here, switch networks directly in your wallet
                  </p>
                </div>
              }
              link="https://ethereum.org/en/developers/docs/networks/"
            />
          </label>
          <div className="relative">
            {!isConnected && (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 opacity-75 rounded-lg z-10 flex items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <AlertCircle size={16} />
                  <span>Connect wallet to select network</span>
                </div>
              </div>
            )}
            <select
              value={currentNetwork || 'ethereum'}
              onChange={(e) => switchNetwork(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
              disabled={!isConnected}
            >
              {Object.entries(SUPPORTED_NETWORKS).map(([key, network]) => (
                <option key={key} value={key}>
                  {network.name}
                </option>
              ))}
              <option value="other" disabled>
                Other Networks (Use Wallet)
              </option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-green-600/50 dark:text-green-400/50" size={20} />
            <h3 className="font-medium text-gray-800/50 dark:text-white/50">Security Features</h3>
            <span className="text-sm text-yellow-600 dark:text-yellow-500 ml-2">(Coming Soon)</span>
            <Tooltip 
              content={
                <div>
                  <p>Advanced security features for your token:</p>
                  <ul className="list-disc ml-4 mt-2">
                    <li><strong>Burn:</strong> Allows permanent removal of tokens from circulation</li>
                    <li><strong>Pause:</strong> Temporarily freeze all token transfers in emergencies</li>
                    <li><strong>Blacklist:</strong> Block specific addresses from using the token</li>
                  </ul>
                  <p className="mt-2 text-yellow-500">Coming Soon!</p>
                </div>
              }
              link="https://ethereum.org/en/developers/docs/smart-contracts/security/"
            />
          </div>
          <div className="space-y-2 opacity-50 blur-[0.3px]">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-indigo-600 dark:text-indigo-500" disabled />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable burn mechanism</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-indigo-600 dark:text-indigo-500" disabled />
              <span className="text-sm text-gray-700 dark:text-gray-300">Include pause functionality</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-indigo-600 dark:text-indigo-500" disabled />
              <span className="text-sm text-gray-700 dark:text-gray-300">Add blacklist feature</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isConnected || isDeploying}
          className="w-full py-3 px-6 text-white bg-indigo-600 dark:bg-indigo-500 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isDeploying ? 'Deploying...' : 'Deploy Token'}
        </button>
      </form>
    </div>
  );
}