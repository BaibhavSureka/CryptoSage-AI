'use client';

import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import {
  HexString,
  Price,
  PriceServiceConnection,
} from "@pythnetwork/price-service-client";
import { Card, CardContent } from "@/components/ui/card";
import { ChainState, ExchangeRateMeta, tokenQtyToNumber } from "@/lib/utils";
import { CONFIG_CONTRACT, getBalance } from "@/lib/web3";
import { OrderEntry } from "./OrderEntry";
import { PriceText } from "./PriceText";
import { MintButton } from "./MintButton";
import { Button } from "@/components/ui/button";

export function Swap({ showBalance = false }: { showBalance?: boolean }) {
  const { status, connect, account, ethereum } = useMetaMask();
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
  const [chainState, setChainState] = useState<ChainState | undefined>(undefined);
  const [pythPrices, setPythPrices] = useState<Record<HexString, Price>>({});
  const [exchangeRateMeta, setExchangeRateMeta] = useState<ExchangeRateMeta | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isBuying, setIsBuying] = useState<boolean>(true);

  useEffect(() => {
    if (status === "connected") {
      setWeb3(new Web3(ethereum));
    }
  }, [status, ethereum]);

  useEffect(() => {
    async function updateBalances() {
      if (web3 && account) {
        setChainState({
          accountBaseBalance: await getBalance(web3, CONFIG_CONTRACT.baseToken.erc20Address, account),
          accountQuoteBalance: await getBalance(web3, CONFIG_CONTRACT.quoteToken.erc20Address, account),
          poolBaseBalance: await getBalance(web3, CONFIG_CONTRACT.baseToken.erc20Address, CONFIG_CONTRACT.swapContractAddress),
          poolQuoteBalance: await getBalance(web3, CONFIG_CONTRACT.quoteToken.erc20Address, CONFIG_CONTRACT.swapContractAddress),
        });
      } else {
        setChainState(undefined);
      }
    }

    const interval = setInterval(updateBalances, 3000);
    return () => clearInterval(interval);
  }, [web3, account]);

  useEffect(() => {
    const pythService = new PriceServiceConnection(CONFIG_CONTRACT.hermesUrl, {
      logger: { error: console.error, warn: console.warn, info: () => {}, debug: () => {}, trace: () => {} },
    });

    pythService.subscribePriceFeedUpdates(
      [CONFIG_CONTRACT.baseToken.pythPriceFeedId, CONFIG_CONTRACT.quoteToken.pythPriceFeedId],
      (priceFeed) => {
        setPythPrices((prev) => ({ ...prev, [priceFeed.id]: priceFeed.getPriceUnchecked() }));
      }
    );
  }, []);

  useEffect(() => {
    const basePrice = pythPrices[CONFIG_CONTRACT.baseToken.pythPriceFeedId];
    const quotePrice = pythPrices[CONFIG_CONTRACT.quoteToken.pythPriceFeedId];
    if (basePrice && quotePrice) {
      setExchangeRateMeta({
        rate: basePrice.getPriceAsNumberUnchecked() / quotePrice.getPriceAsNumberUnchecked(),
        lastUpdatedTime: new Date(Math.max(basePrice.publishTime, quotePrice.publishTime) * 1000),
      });
    } else {
      setExchangeRateMeta(undefined);
    }
  }, [pythPrices]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      {showBalance ? (
        <CardContent>
          {status === "connected" ? (
            <p>Connected Wallet: {account}</p>
          ) : (
            <Button onClick={connect}>Connect Wallet</Button>
          )}
          <h3>Wallet Balances</h3>
          {chainState ? (
            <Card>
              <p>{tokenQtyToNumber(chainState.accountBaseBalance, CONFIG_CONTRACT.baseToken.decimals)} {CONFIG_CONTRACT.baseToken.name}</p>
              <p>{tokenQtyToNumber(chainState.accountQuoteBalance, CONFIG_CONTRACT.quoteToken.decimals)} {CONFIG_CONTRACT.quoteToken.name}</p>
            </Card>
          ) : (
            <Card>Loading...</Card>
          )}
        </CardContent>
      ) : (
        <CardContent>
          <h3>Swap {CONFIG_CONTRACT.baseToken.name} ↔ {CONFIG_CONTRACT.quoteToken.name}</h3>
          <PriceText price={pythPrices} currentTime={currentTime} rate={exchangeRateMeta} baseToken={CONFIG_CONTRACT.baseToken} quoteToken={CONFIG_CONTRACT.quoteToken} />
          <div>
            <Button className={isBuying ? "active" : ""} onClick={() => setIsBuying(true)}>Buy</Button>
            <Button className={!isBuying ? "active" : ""} onClick={() => setIsBuying(false)}>Sell</Button>
          </div>
          <OrderEntry
            web3={web3}
            account={account}
            isBuy={isBuying}
            approxPrice={exchangeRateMeta?.rate}
            baseToken={CONFIG_CONTRACT.baseToken}
            quoteToken={CONFIG_CONTRACT.quoteToken}
            hermesUrl={CONFIG_CONTRACT.hermesUrl}
            pythContractAddress={CONFIG_CONTRACT.pythContractAddress}
            swapContractAddress={CONFIG_CONTRACT.swapContractAddress}
          />
        </CardContent>
      )}
    </Card>
  );
}