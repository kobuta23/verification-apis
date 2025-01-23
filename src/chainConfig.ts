const chains: Record<number, string> = {
  100: "xdai-mainnet",
  137: "polygon-mainnet", 
  10: "optimism-mainnet",
  42161: "arbitrum-one",
  43114: "avalanche-c",
  56: "bsc-mainnet",
  1: "eth-mainnet",
  42220: "celo-mainnet",
  8453: "base-mainnet",
  534352: "scroll-mainnet",
  666666666: "degenchain"

};

export const getSubgraphEndpoint = (identifier: number | string): string | undefined => {
  const chainName = typeof identifier === "number"
    ? chains[identifier]
    : identifier;
  return chainName ? `https://subgraph-endpoints.superfluid.dev/${chainName}/protocol-v1` : undefined;
};

export { chains };