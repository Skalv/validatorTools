import React, { useCallback, useEffect, useState } from "react";
import { usePools } from "../../hooks/usePools";
import { useAccount, useBlockNumber, useWriteContract } from "wagmi";
import { BerachefAbi } from "../../../ABIs/BerachefAbi";

type Weight = {
  receiver: `0x${string}`;
  percentageNumerator: bigint;
};

export function Pools() {
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber();
  const [weights, setWeights] = useState<Weight[]>([]);
  const { status, data, error, isFetching } = usePools();

  const handleSubmit = useCallback(() => {
    if (!address || !blockNumber) return;
    const total = weights.reduce((total, weight) => {
      return total + weight.percentageNumerator;
    }, 0n);

    if (total !== 10000n) {
      alert("Total must be equal to 100%");
      return;
    }
    console.log(total, address, blockNumber);

    writeContract({
      abi: BerachefAbi,
      address: "0xfb81E39E3970076ab2693fA5C45A07Cc724C93c2",
      functionName: "queueNewCuttingBoard",
      args: [address, blockNumber + 100n, weights],
    });
  }, [weights, address, blockNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vaultAddress = e.target.getAttribute(
      "data-vaultaddr",
    ) as `0x${string}`;
    const inputValue = parseFloat(e.target.value)
    const value = BigInt(Math.round(inputValue * 100));

    if (!vaultAddress) return;

    if (value === 0n) {
      setWeights([...weights.filter((w) => w.receiver != vaultAddress)]);
    } else {
      setWeights([
        ...weights.filter((w: Weight) => w.receiver != vaultAddress),
        { receiver: vaultAddress, percentageNumerator: value },
      ]);
    }
  };

  return (
    <div>
      <h1>Pools</h1>
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Reward Vaults</th>
                  <th>Total Incentive value</th>
                  <th>BGT Capture</th>
                  <th>Incentive</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((vault) => (
                    <tr key={vault.id}>
                      <td>
                        {vault.metadata.name}
                        <br />
                        {vault.metadata.product}
                      </td>
                      <td>{vault.activeIncentivesInHoney} HONEY</td>
                      <td>{(vault.bgtInflationCapture / 100).toFixed(2)}%</td>
                      <td>
                        <ul>
                          {vault.activeIncentives.map((i) => (
                            <li key={i.id}>{i.token.name}</li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <input
                          onChange={handleChange}
                          type="number"
                          min={0}
                          max={100}
                          step={0.01}
                          name="percent"
                          data-vaultAddr={vault.vaultAddress}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button onClick={handleSubmit}>Queued new cutting board</button>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
}
