import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const NETWORK_CONFIGS = {
  ethereum: {
    apiUrl: 'https://api.etherscan.io/api',
    apiKey: process.env.VITE_ETHERSCAN_API_KEY,
    module: 'account',
    action: 'tokentx'
  },
  polygon: {
    apiUrl: 'https://api.polygonscan.com/api',
    apiKey: process.env.VITE_POLYGONSCAN_API_KEY,
    module: 'account',
    action: 'tokentx'
  },
  bsc: {
    apiUrl: 'https://api.bscscan.com/api',
    apiKey: process.env.VITE_BSCSCAN_API_KEY,
    module: 'account',
    action: 'tokentx'
  },
  arbitrum: {
    apiUrl: 'https://api.arbiscan.io/api',
    apiKey: process.env.VITE_ARBISCAN_API_KEY,
    module: 'account',
    action: 'tokentx'
  }
} as const;

type NetworkKey = keyof typeof NETWORK_CONFIGS;

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const { address, network } = JSON.parse(event.body);

    if (!address) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: '0',
          message: 'Address is required'
        })
      };
    }

    // Validate network key
    if (!network || !Object.keys(NETWORK_CONFIGS).includes(network)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: '0',
          message: `Invalid network. Supported networks are: ${Object.keys(NETWORK_CONFIGS).join(', ')}`
        })
      };
    }

    const networkConfig = NETWORK_CONFIGS[network as NetworkKey];
    const apiKey = networkConfig.apiKey;

    if (!apiKey) {
      console.error(`API key missing for ${network}`);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: '0',
          message: `API configuration missing for ${network}`
        })
      };
    }

    const params = new URLSearchParams({
      module: networkConfig.module,
      action: networkConfig.action,
      address: address,
      sort: 'desc',
      apikey: apiKey
    });

    const url = `${networkConfig.apiUrl}?${params.toString()}`;
    
    console.log(`Fetching from ${network}: ${networkConfig.apiUrl}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    
    try {
      const jsonData = JSON.parse(data);
      
      if (jsonData.message === 'NOTOK' || jsonData.status === '0') {
        throw new Error(jsonData.result || 'API request failed');
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(jsonData)
      };
    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Raw response:', data);
      throw new Error('Invalid response from API');
    }

  } catch (error: any) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: '0',
        message: error.message || 'Internal server error'
      })
    };
  }
}