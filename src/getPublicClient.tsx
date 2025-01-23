import { createPublicClient, http, parseAbi } from 'viem';
import { polygon, optimism, arbitrum, avalanche, bsc, base, scroll, degen, celo, gnosis } from 'viem/chains';

export const getPublicClient = (chainId) => {
    // TODO: use chainId instead of chain name to differentiate
    if(chain.name === 'polygon-mainnet') {
      return createPublicClient({
        chain: polygon,
        transport: http()
      });
    } else if(chain.name === 'optimism-mainnet') {
      return createPublicClient({
        chain: optimism,
        transport: http()
      });
    } else if(chain.name === 'arbitrum-one') {
      return createPublicClient({
        chain: arbitrum,
        transport: http()
      });
    } else if(chain.name === 'avalanche-c') {
      return createPublicClient({
        chain: avalanche,
        transport: http()
      });
    } else if(chain.name === 'bsc-mainnet') {
      return createPublicClient({
        chain: bsc,
        transport: http()
      });
    } else if(chain.name === 'base-mainnet') {
      return createPublicClient({
        chain: base,
        transport: http()
      });
    } else if(chain.name === 'scroll-mainnet') {
      return createPublicClient({
        chain: scroll,
        transport: http()
      });
    } else if(chain.name === 'degenchain') {
      return createPublicClient({
        chain: degen,
        transport: http()
      });
    } else if(chain.name === 'celo-mainnet') {
      return createPublicClient({
        chain: celo,
        transport: http()
      });
    } else if(chain.name === 'xdai-mainnet' || chain.name === 'gnosis-mainnet' || chain.name === 'gnosis' || chain.name === 'gnosis-chain' || chain.name === 'xdai') {
      return createPublicClient({
        chain: gnosis,
        transport: http()
      });
    } else if(chain.name === 'eth-mainnet') {
      return createPublicClient({
        chain: mainnet,
        transport: http()
      });
    } else {
      throw new Error(`Unsupported chain: ${chain.name}`);
    }
  }
  