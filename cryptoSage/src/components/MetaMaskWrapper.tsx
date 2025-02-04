"use client";

import { MetaMaskProvider } from "metamask-react";

const MetaMaskWrapper = ({ children }: { children: React.ReactNode }) => {
  return <MetaMaskProvider>{children}</MetaMaskProvider>;
};

export default MetaMaskWrapper;
