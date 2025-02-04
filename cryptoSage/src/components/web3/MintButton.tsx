import Web3 from "web3";
import { numberToTokenQty } from "@/lib/utils";
import { mint } from "@/lib/web3";
import { Button } from "../ui/button";
import { useState } from "react";

export function MintButton(props: {
  web3: Web3;
  sender: string;
  erc20Address: string;
  destination: string;
  qty: number;
  decimals: number;
}) {
  const [txHash, setTxHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleMint = async () => {
    if (props.qty <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const receipt = await mint(
        props.web3,
        props.sender,
        props.erc20Address,
        props.destination,
        numberToTokenQty(props.qty, props.decimals)
      );
      console.log("Transaction Hash:", receipt);
      setTxHash(receipt.transactionHash);
    } catch (err) {
      console.error("Minting failed:", err);
      setError("Minting failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleMint} disabled={loading}>
        {loading ? "Minting..." : `Mint ${props.qty}`}
      </Button>

      {txHash && (
        <p>
          ✅ Transaction Hash:{" "}
          <a
            href={`https://base-sepolia.blockscout.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {txHash}
          </a>
        </p>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
