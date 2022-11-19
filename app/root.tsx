import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "./styles/app.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Tweet.Win",
  description:
    "Never trust a random giveaway tweet again. Our giveaways are cryptographically fair! Guaranteed pay-out through smart contracts.",
  viewport: "width=device-width,initial-scale=1",
  "twitter:card": "summary_large_image",
  "twitter:site": "https://tweet.win",
  "twitter:title": "Tweet.win - Cryptographically guaranteed giveaways!",
  "twitter:description": `Never trust a giveaway tweet anymore!
    Our giveaways are cryptographically fair 😇
    Creating a tweet giveaway is under 1 dollar!
    Only scammers wouldn't pay that 🤩
     and create a Tweet.win profile (if you don't have one already) to participate in this guaranteed tweet giveaway!`,
  "twitter:image": "/placeholder-tweet-win.png",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
