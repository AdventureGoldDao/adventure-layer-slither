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

export function setBurnerPrivateKey(privateKey: string, cacheKey = "mud:burnerWallet"): Hex {
  localStorage.setItem(cacheKey, privateKey);
  if (privateKey === null) {
    console.error("Private key found in cache is not valid hex", { privateKey, cacheKey });
    throw new Error(`Private key found in cache (${cacheKey}) is not valid hex`);
  }

  assertPrivateKey(privateKey, cacheKey);
  console.log("Old burner wallet updated:", privateKeyToAccount(privateKey));
  return privateKey;
}

export function setConnectedAccount(address: string, cacheKey = "ad:connectedAccount"): Hex {
  localStorage.setItem(cacheKey, address);
  if (address === null) {
    console.error("Connected Address found in cache is not valid hex", { address, cacheKey });
    throw new Error(`Connected Address found in cache (${cacheKey}) is not valid hex`);
  }

  if (!isHex(address)) {
    console.error("Connected Address found in cache is not valid hex", { address, cacheKey });
    throw new Error(`Connected Address found in cache (${cacheKey}) is not valid hex`);
  }
  return address;
}

export function getConnectedAccount(cacheKey = "ad:connectedAccount"): Hex {
  const cachedAddress = localStorage.getItem(cacheKey);

  if (cachedAddress && !isHex(cachedAddress)) {
    console.error("Connected Address found in cache is not valid hex", { cachedAddress, cacheKey });
    throw new Error(`Connected Address found in cache (${cacheKey}) is not valid hex`);
  }
  return cachedAddress;
}
