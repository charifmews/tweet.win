import { authenticator } from "~/services/auth.server";
import { ActionFunction } from "@remix-run/server-runtime";

// Normally this will redirect user to twitter auth page
export let action: ActionFunction = async ({ request }) => {
  await authenticator.authenticate("twitter", request, {
    successRedirect: "/dashboard", // Destination in case the user is already logged in
  });
};
