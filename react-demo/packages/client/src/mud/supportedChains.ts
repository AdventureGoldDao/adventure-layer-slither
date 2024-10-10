/*
 * The supported chains.
 * By default, there are only two chains here:
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 * - Redstone, our production blockchain (https://redstone.xyz/)
 * - Garnet, our test blockchain (https://garnetchain.com/))
 *
 */

import { MUDChain, mudFoundry, redstone, garnet } from "@latticexyz/common/chains";

const localNitro: MUDChain = {
    id: 12340213,
    name: "shard",
    nativeCurrency: {
        decimals: 18,
        name: "Shard",
        symbol: "AGLD",
    },
    rpcUrls: {
        default: {
            http: ["http://34.228.184.10:8587"],
            webSocket: ["http://34.228.184.10:8588"],
        },
    }
};
/*
 * See https://mud.dev/guides/hello-world/add-chain-client
 * for instructions on how to add networks.
 */
export const supportedChains: MUDChain[] = [localNitro, mudFoundry, redstone, garnet];
