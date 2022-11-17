import { createCookieSessionStorage } from "@remix-run/node";

const clientID = process.env.TWITTER_CONSUMER_KEY;
const clientSecret = process.env.TWITTER_CONSUMER_SECRET;
if (!clientID || !clientSecret) {
  throw new Error(
    "TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET must be provided"
  );
}
// export the whole sessionStorage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.SECRET || "localsecret"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage;
