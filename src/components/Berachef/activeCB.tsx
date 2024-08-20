import { useAccount, useReadContracts } from "wagmi";
import { BerachefAbi } from "../../../ABIs/BerachefAbi";
import { useEffect } from "react";

export function ActiveCuttingBoard() {
  const stakelabAddr: `0x${string}` =
    "0xC5b889a28950e7F8c1F279f758d8a0ab1C89cC38";

  const { address } = useAccount();
  const berachefContract = {
    address: "0xfb81E39E3970076ab2693fA5C45A07Cc724C93c2" as `0x${string}`,
    abi: BerachefAbi,
  };

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        ...berachefContract,
        functionName: "getActiveCuttingBoard",
        args: [address],
      },
      {
        ...berachefContract,
        functionName: "getQueuedCuttingBoard",
        args: [address],
      },
      {
        ...berachefContract,
        functionName: "getDefaultCuttingBoard",
      },
    ],
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <h2>Active cutting board</h2>
      <table>
        <thead>
          <tr>
            <th>Receiver</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && data && data[0].status === "success" && (
            <>
              {data[0].result.weights.map((w) => (
                <tr>
                  <td>{w.receiver}</td>
                  <td>{w.percentageNumerator.toString()}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
      <hr />
      <h2>Queued cutting board</h2>
      <table>
        <thead>
          <tr>
            <th>Receiver</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && data && data[1].status === "success" && (
            <>
              {data[1].result.weights.map((w) => (
                <tr>
                  <td>{w.receiver}</td>
                  <td>{w.percentageNumerator.toString()}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
      <hr />
      <h2>Default cutting board</h2>
      <table>
        <thead>
          <tr>
            <th>Receiver</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && data && data[2].status === "success" && (
            <>
              {data[2].result.weights.map((w) => (
                <tr>
                  <td>{w.receiver}</td>
                  <td>{w.percentageNumerator.toString()}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </>
  );
}
