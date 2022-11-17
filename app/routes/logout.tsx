import { authenticator } from "~/services/auth.server";
import { ActionFunction } from "@remix-run/server-runtime";
import { LoaderFunction } from "@remix-run/node";

export let action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/" });
};

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/" });
};
