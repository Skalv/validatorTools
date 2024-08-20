import { useQuery } from "@tanstack/react-query";

export function usePools() {
  return useQuery({
    queryKey: ["pools"],
    queryFn: async () => {
      const response = await fetch(
        "https://bartio-pol-indexer.berachain-devnet.com/berachain/v1alpha1/beacon/vaults",
      );
      const result = await response.json();

      return result?.vaults;
    },
  });
}
