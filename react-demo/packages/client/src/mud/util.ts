import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { isHex, Hex } from "viem";

export const BurnerCacheKey = 'mud:burnerWallet'

function assertPrivateKey(privateKey: string, cacheKey: string): asserts privateKey is Hex {
  if (!isHex(privateKey)) {
    console.error("Private key found in cache is not valid hex", { privateKey, cacheKey });
    throw new Error(`Private key found in cache (${cacheKey}) is not valid hex`);
  }
  // ensure we can extract address from private key
  // this should throw on bad private keys
  privateKeyToAccount(privateKey);
}

export function setBurnerPrivateKey(privateKey, cacheKey = "mud:burnerWallet"): Hex {
  localStorage.setItem(cacheKey, privateKey);
  if (privateKey === null) {
    console.error("Private key found in cache is not valid hex", { privateKey, cacheKey });
    throw new Error(`Private key found in cache (${cacheKey}) is not valid hex`);
  }

  assertPrivateKey(privateKey, cacheKey);
  console.log("Old burner wallet updated:", privateKeyToAccount(privateKey));
  return privateKey;
}
