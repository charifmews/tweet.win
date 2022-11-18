import type { ActionFunction } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Redis } from "@upstash/redis";
import { Web3Storage } from "web3.storage";
import { webcrypto } from 'crypto'

export const action: ActionFunction = async ({ request }) => {
  const redis = Redis.fromEnv();
  const crypto = webcrypto as unknown as Crypto
  const random = crypto.getRandomValues(new Uint32Array(1))
  console.log(random[0])    
  // 1565168784
  // 1691232174
  // 1668803773
  // const token = process.env.WEB3_STORAGE || ""
  // const storage = new Web3Storage({ token })
  // const file = new File(['{}'], 'test.json', { type: 'application/json' })
  // const cid = await storage.put([file])

  // console.log(cid)
  return json({ message: random[0] });
};
