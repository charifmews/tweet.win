import type { ActionFunction } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Redis } from "@upstash/redis";
import { authenticator } from "~/services/auth.server";
import { getTweet } from "~/services/twitter.server";

export const action: ActionFunction = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return json({ message: "Not Authenticated" }, 401);

  switch (request.method) {
    case "PUT": {
      const { giveawayName } = await request.json();
      const tweet = await getTweet(params.tweetID);
      if (tweet.data) {
        const redis = Redis.fromEnv();
        await redis.hset(`g:${giveawayName}`, {
          ["status"]: "ongoing",
          ["tweet"]: params.tweetID,
        });

        return json({ message: "Tweet has been linked with giveaway!" }, 200);
      } else {
        return json({ message: "Tweet doesn't exist!" }, 400);
      }
    }

    default:
      return json({ message: "Method not allowed" }, 405);
  }
};
