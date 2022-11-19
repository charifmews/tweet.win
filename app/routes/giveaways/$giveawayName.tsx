import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { Redis } from "@upstash/redis";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { authenticator, User } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  let user: User | null = await authenticator.isAuthenticated(request);

  const redis = Redis.fromEnv();
  const giveaway = await redis.hgetall(`g:${params.giveawayName}`);

  return { user, giveaway };
};

type LoaderData = {
  user: User;
  giveaway: {
    amount: number;
    expiration: number;
    owner: number;
    status: string;
    token: string;
  };
};

export default function Giveaway() {
  const { user, giveaway } = useLoaderData<LoaderData>();
  const [tweetID, setTweetID] = useState<string>("");
  const params = useParams();
  const deadline = new Date((giveaway.expiration - 600) * 1000);
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-blue-200 py-12 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="max-w-2xl overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-xl font-medium leading-6 text-gray-900">
            Giveaway: {params.giveawayName}
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Prize</dt>
              <dd className="mt-1 flex items-center text-sm text-gray-900 ">
                <span className="ml-1">{giveaway.amount}</span>
                <img className="ml-1 h-4" src="/tokens/link.png" alt="$LINK" />
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">
                {giveaway.status.replace("-", " ")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Expires</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {deadline.toISOString().replace("T", " ").replace(".000Z", "")}
              </dd>
            </div>
          </dl>
          {user.id === giveaway.owner && giveaway.status === "need-tweet" && (
            <div className="mt-12">
              <div>
                <label
                  htmlFor="tweet-id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Link tweet ID (example: https://twitter.com/elonmusk/status/
                  <b>1593624195136487426</b>)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    value={tweetID}
                    onChange={(e) => setTweetID(e.target.value)}
                    className="mt-4 block w-full rounded-md border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="1593624195136487426"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <QuestionMarkCircleIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <button
                  onClick={async () => {
                    console.log(tweetID)
                    const response = await fetch(`/api/tweet/${tweetID}`, {
                      method: "PUT",
                      body: JSON.stringify({
                        giveawayName: params.giveawayName,
                      }),
                    });

                    if (response.status === 200) {
                      toast.success("Tweet linked");
                      setTimeout(function () {
                        location.reload();
                      }, 2000);
                    } else {
                      toast.error(
                        "Could not link the tweet with the giveaway, send us a Twitter DM @The_Tweet_Win to figure out what is wrong"
                      );
                    }
                  }}
                  className="mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Link Tweet ID with Giveaway
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
