import type { ActionFunction } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Redis } from "@upstash/redis";
import { Web3Storage } from "web3.storage";
import { webcrypto } from "crypto";
import { getRetweets } from "~/services/twitter.server";

// Vercel serverless limit is 5 min runtime, this will work fine for now
// but when it grows we need a different solution.
export const action: ActionFunction = async ({ request }) => {
  if (
    request.method === "POST" &&
    request.headers.get("authorization") ===
      `Bearer ${process.env.API_SECRET_KEY}`
  ) {
    const redis = Redis.fromEnv();
    // Get all non expired giveaways
    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    const threeDaysInSeconds = 3 * 24 * 60 * 60;
    const limitGiveAwaysEpochSeconds = secondsSinceEpoch + threeDaysInSeconds;

    // Web3 Storage
    const token = process.env.WEB3_STORAGE;
    const storage = new Web3Storage({ token });

    const giveaways = await redis.zrange(
      "giveaways-with-expiration",
      secondsSinceEpoch,
      limitGiveAwaysEpochSeconds,
      { byScore: true }
    );

    giveaways.map(async (giveawayName) => {
      const giveaway = await redis.hgetall(`g:${giveawayName}`);
      if (!giveaway) return;
      switch (giveaway.status) {
        case "ongoing":

        const retweeters = await getRetweets(giveaway.tweet, giveaway.pagination_token);

        // time check stop 10min before expiration
          // store twitter pagination token
          if (giveaway.expiration - secondsSinceEpoch < 600) {
            await redis.hset(`g:${giveawayName}`, {
              ["status"]: "ready-for-process",
            });
          }
          // fetch retweets
          break;
        case "ready-for-process":
          const crypto = webcrypto as unknown as Crypto;
          const random = crypto.getRandomValues(new Uint32Array(1));

          // get all retweeter IDS
          // get map
          // find all prize candidates

          const offChainProof = {
            retweeters: [],
            twitterIdWalletMap: {},
            candidates: [],
            random: random[0],
            msSinceEpoch: Date.now(),
          };

          const file = new File([JSON.stringify(offChainProof)], "test.json", {
            type: "application/json",
          });
          const cid = await storage.put([file]);

          await redis.hset(`g:${giveawayName}`, {
            ["status"]: "decentralised-stored",
            ["random"]: random[0],
            ["cid"]: cid,
          });
          break;
        case "decentralised-stored":
          // clean up
          break;
        case "winner-payed":
          // clean up
          break;
      }
    });

    return json({ message: giveaways });
  } else {
    return json({ message: "Unauthorized" }, 401);
  }
};
