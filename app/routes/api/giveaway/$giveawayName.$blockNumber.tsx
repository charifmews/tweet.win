import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params.giveawayName);
  console.log(params.blockNumber);

  return json({
    giveaway: params.giveawayName,
    winner: "0x2839d13174d7aeD849af852BD30c5bC2216Cc9e5",
  });
};
