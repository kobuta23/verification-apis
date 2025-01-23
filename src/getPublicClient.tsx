import { createPublicClient, http } from 'viem';
import { 
  polygon, 
  optimism, 
  arbitrum, 
  avalanche, 
  bsc, 
  base, 
  scroll, 
  degen, 
  celo, 
  gnosis, 
  mainnet 
} from 'viem/chains';
import { chains } from './chainConfig.js';

export const getPublicClient = (chainId: number) => {
    const chainName = chains[chainId];
    if (!chainName) {
        throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    switch (chainName) {
        case 'polygon-mainnet':
            return createPublicClient({
                chain: polygon,
                transport: http()
            });
        case 'optimism-mainnet':
            return createPublicClient({
                chain: optimism,
                transport: http()
            });
        case 'arbitrum-one':
            return createPublicClient({
                chain: arbitrum,
                transport: http()
            });
        case 'avalanche-c':
            return createPublicClient({
                chain: avalanche,
                transport: http()
            });
        case 'bsc-mainnet':
            return createPublicClient({
                chain: bsc,
                transport: http()
            });
        case 'base-mainnet':
            return createPublicClient({
                chain: base,
                transport: http()
            });
        case 'scroll-mainnet':
            return createPublicClient({
                chain: scroll,
                transport: http()
            });
        case 'degenchain':
            return createPublicClient({
                chain: degen,
                transport: http()
            });
        case 'celo-mainnet':
            return createPublicClient({
                chain: celo,
                transport: http()
            });
        case 'xdai-mainnet':
        case 'gnosis-mainnet':
        case 'gnosis':
        case 'gnosis-chain':
        case 'xdai':
            return createPublicClient({
                chain: gnosis,
                transport: http()
            });
        case 'eth-mainnet':
            return createPublicClient({
                chain: mainnet,
                transport: http()
            });
        default:
            throw new Error(`Unsupported chain: ${chainName}`);
    }
}
  