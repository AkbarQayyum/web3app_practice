import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";

export const providerOptions = {
  binancechainwallet: {
    package: true,
  },
  walletconnect: {
    package: WalletConnect,
    options: {
      rpc: "https://mainnet.infura.io/v3/02a5c78babba4898ad4a667b40a1d843",
      infuraId: "02a5c78babba4898ad4a667b40a1d843",
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "web3app_practice",
      rpc: "https://mainnet.infura.io/v3/02a5c78babba4898ad4a667b40a1d843",
      infuraId: "02a5c78babba4898ad4a667b40a1d843",
    },
  },
};
