import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Redis } from "@upstash/redis";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return json({ message: "Not Authenticated" }, 401);

  const redis = Redis.fromEnv();
  const exist = await redis.sismember("giveaways", params.giveawayName);

  return json({
    giveaway: params.giveawayName,
    exist,
  });
};
