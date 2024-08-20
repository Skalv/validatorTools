import { useAccount } from "wagmi";
import { WalletOptions } from "./WalletOptions";
import { Account } from "./account";

export default function Connect() {
  const { isConnected } = useAccount();

  if (isConnected) return <Account />;
  return <WalletOptions />;
}
