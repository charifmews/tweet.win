import type { ActionFunction } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Redis } from "@upstash/redis";
import { authenticator } from "~/services/auth.server";
import { verifyMessage } from "ethers/lib/utils";

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return json({ message: "Not Authenticated" }, 401);

  switch (request.method) {
    case "POST": {
      const { address, signature } = await request.json();
      const addressFromSignature = verifyMessage(
        `Link Twitter @${user.screen_name} with Web3 wallet ${address}`,
        signature
      );

      if (address == addressFromSignature) {
        const redis = Redis.fromEnv();
        await redis.hset(`u:${user.id.toString()}`, {
          ["wallet"]: addressFromSignature,
        });
        await redis.hset("twitterIdWalletMap", {
          [user.id.toString()]: addressFromSignature,
        });
        await redis.hset("walletTwitterIdMap", {
          [addressFromSignature]: user.id.toString(),
        });
        return json(
          { message: "Wallet successfully linked to Twitter user" },
          201
        );
      } else {
        return json({ message: "Signature isn't correct" }, 400);
      }
    }
    case "DELETE": {
      const redis = Redis.fromEnv();
      await redis.hdel(user.id.toString(), "wallet");
      return json({}, 204);
    }
    default:
      return json({ message: "Method not allowed" }, 405);
  }
};
