import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params.giveawayName);
  console.log(params.blockNumber);
  const giveaway = await redis.hgetall(`g:${params.giveawayName}`);

  if (giveaway.status === "decentralised-stored") {
    await redis.hset(`g:${params.giveawayName}`, {
      ["status"]: "winner-payed",
      ["winner"]: "",
    });

    return json({
      giveaway: params.giveawayName,
      winner: "0x2839d13174d7aeD849af852BD30c5bC2216Cc9e5",
    });
  }
};
