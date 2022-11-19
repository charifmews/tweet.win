import type { ActionFunction } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Redis } from "@upstash/redis";
import { authenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return json({ message: "Not Authenticated" }, 401);

  switch (request.method) {
    case "POST": {
      const { amount, expiration, token } = await request.json();
      // This can never happen unless they directly call this endpoint
      if (amount < 1 || amount > 100)
        return json({ message: "Incorrect amount" }, 400);
      if (token !== "LINK") return json({ message: "Unsupported ERC-20" }, 400);

      const redis = Redis.fromEnv();
      const exist = await redis.sismember("giveaways", params.giveawayName);
      if (!exist) {
        redis.zadd("giveaways-with-expiration", {
          score: parseInt(expiration),
          member: params.giveawayName,
        });
        await redis.hset(`g:${params.giveawayName}`, {
          ["expiration"]: expiration,
          ["amount"]: amount,
          ["token"]: token,
          ["owner"]: user.id,
          ["status"]: "need-tweet",
        });
        await redis.sadd("giveaways", params.giveawayName);
        await redis.lpush(`list-giveaways:${user.id}`, params.giveawayName);
        return json({ message: "Giveaway has been created!" }, 201);
      } else {
        return json({ message: "Giveaway already exist!" }, 400);
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
