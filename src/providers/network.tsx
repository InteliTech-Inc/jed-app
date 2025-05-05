"use client";

import dynamic from "next/dynamic";

const NetworkStatus = dynamic(() => import("../components/network"), {
  ssr: false,
});

type NetworkProviderProps = {
  children: React.ReactNode;
};

export function NetworkProvider({ children }: NetworkProviderProps) {
  return (
    <div>
      {children}
      <NetworkStatus />
    </div>
  );
}
