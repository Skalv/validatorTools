import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createConfig, http, WagmiProvider } from "wagmi";
import { berachainTestnetbArtio } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, metaMask, safe } from "wagmi/connectors";

const wagmiConfig = createConfig({
  chains: [berachainTestnetbArtio],
  connectors: [injected(), metaMask(), safe()],
  transports: {
    [berachainTestnetbArtio.id]: http(),
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
