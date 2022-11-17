import { authenticator } from "~/services/auth.server";
import { LoaderFunction } from "@remix-run/server-runtime";

// This will be called after twitter auth page
export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("twitter", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login/failure",
  });
};
