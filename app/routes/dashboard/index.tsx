import React, { useState } from "react";
import { BigNumber, ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import LinkABI from "~/lib/LinkABI.json";
import GiveawayTweetABI from "~/lib/GiveawayTweetABI.json";
import { authenticator, User } from "~/services/auth.server";
import { LoaderFunction } from "@remix-run/server-runtime";
import { Link, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Logo } from "~/components/website/Logo";
import UnlinkedLogo from "~/images/logos/unlink.svg";
import { Redis } from "@upstash/redis";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { GiftIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

export const loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request);
  if (!user) return redirect("/");

  const redis = Redis.fromEnv();
  const userData = await redis.hgetall(user.id.toString());
  user = { ...user, ...userData };

  return { user };
};
type LoaderData = {
  user: User;
};

const navigation = [
  { route: "onboarding" },
  { route: "dashboard" },
  { route: "overview Giveaways" },
  { route: "create Giveaway" },
  { route: "your Giveaways" },
];

const userNavigation = [{ name: "Sign out", href: "/logout" }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const { user } = useLoaderData<LoaderData>();
  // const [dashboardRoute, setDashboardRoute] = useState<string>(user.wallet ? "dashboard" : "onboarding");
  const [dashboardRoute, setDashboardRoute] =
    useState<string>("create Giveaway");

  const [giveawayName, setGiveawayName] = useState("");
  const [giveawayAmount, setGiveawayAmount] = useState(1);
  const [giveawayDuration, setGiveawayDuration] = useState(1);

  return (
    <>
      <div className="relative min-h-full">
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
        <div className="bg-blue-800 pb-32">
          <Disclosure as="nav" className="bg-blue-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="border-b border-blue-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                      <div className="flex items-center">
                        <Link to="/dashboard" className="h-8 flex-shrink-0">
                          <Logo className="rounded-full border border-white" />
                        </Link>
                        <div className="hidden md:block">
                          <div className="ml-10 flex items-baseline space-x-4">
                            {navigation
                              .filter(
                                (item) =>
                                  user.wallet && item.route !== "onboarding"
                              )
                              .map((item) => (
                                <a
                                  key={item.route}
                                  onClick={() => setDashboardRoute(item.route)}
                                  className={classNames(
                                    dashboardRoute === item.route
                                      ? "bg-blue-900 text-white"
                                      : "text-blue-300 hover:bg-blue-700 hover:text-white",
                                    "cursor-pointer rounded-md px-3 py-2 text-sm font-medium capitalize"
                                  )}
                                  aria-current={
                                    dashboardRoute === item.route
                                      ? "page"
                                      : undefined
                                  }
                                >
                                  {item.route}
                                </a>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                          {/* Profile dropdown */}
                          <Menu as="div" className="relative ml-3">
                            <div>
                              <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="sr-only">Open user menu</span>
                                <img
                                  className="h-8 w-8 rounded-full"
                                  src={user.profile_image_url}
                                  alt=""
                                />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {userNavigation.map((item) => (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <a
                                        href={item.href}
                                        className={classNames(
                                          active ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700"
                                        )}
                                      >
                                        {item.name}
                                      </a>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                      <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-blue-800 p-2 text-blue-400 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800">
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <span className="block h-6 w-6" aria-hidden="true">
                              ╳
                            </span>
                          ) : (
                            <span
                              className="block h-6 w-6 text-center text-2xl leading-4"
                              aria-hidden="true"
                            >
                              ☰
                            </span>
                          )}
                        </Disclosure.Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="border-b border-blue-700 md:hidden">
                  <div className="space-y-1 px-2 py-3 sm:px-3">
                    {navigation
                      .filter(
                        (item) => user.wallet && item.route !== "onboarding"
                      )
                      .map((item) => (
                        <Disclosure.Button
                          key={item.route}
                          as="a"
                          onClick={() => setDashboardRoute(item.route)}
                          className={classNames(
                            item.route
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "block cursor-pointer rounded-md px-3 py-2 text-base font-medium capitalize"
                          )}
                          aria-current={item.route ? "page" : undefined}
                        >
                          {item.route}
                        </Disclosure.Button>
                      ))}
                  </div>
                  <div className="border-t border-blue-700 pt-4 pb-3">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.profile_image_url}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium leading-none text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold capitalize tracking-tight text-white">
                {dashboardRoute}
              </h1>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            {dashboardRoute === "onboarding" && (
              <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                <div className="text-center">
                  <img
                    className="mx-auto w-24"
                    src={UnlinkedLogo}
                    alt="Unlinked Twitter handle"
                  />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    You are not linked with a Wallet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sign a message with your Web3 wallet <br /> and get it
                    linked to your Twitter handle!
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={async () => {
                        const provider = new ethers.providers.Web3Provider(
                          window.ethereum,
                          "any"
                        );
                        // Prompt user for account connections
                        await provider.send("eth_requestAccounts", []);
                        const signer = provider.getSigner();
                        const address = await signer.getAddress();

                        const signature = await signer.signMessage(
                          `Link Twitter @${user.screen_name} with Web3 wallet ${address}`
                        );
                        const resp = await fetch("/api/profile", {
                          method: "POST",
                          body: JSON.stringify({
                            signature,
                            address,
                          }),
                        });
                        if (resp.status === 201) {
                          toast.success("Linked succesfully");
                          setDashboardRoute("dashboard");
                        }
                      }}
                      className="inline-flex items-center rounded-full border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      🔗 Link Wallet with {user.name}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {dashboardRoute === "dashboard" && (
              <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                <div className="mx-auto max-w-lg">
                  <h2 className="text-lg font-medium text-gray-900">
                    Discover Tweet.Win
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Will you create your own giveaway tweet or view all the
                    giveaways tweets
                  </p>
                  <ul
                    role="list"
                    className="mt-6 divide-y divide-gray-200 border-t border-b border-gray-200"
                  >
                    {[
                      {
                        name: "Create your own Giveaway Tweet",
                        description:
                          "Spread your message and let your project go viral",
                        route: "create Giveaway",
                        iconColor: "bg-purple-500",
                        icon: MegaphoneIcon,
                      },
                      {
                        name: "Giveaways",
                        description:
                          "See all GiveAway tweets and retweet if you like them",
                        route: "overview Giveaways",
                        iconColor: "bg-blue-500",
                        icon: GiftIcon,
                      },
                    ].map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <div className="group relative flex cursor-pointer items-start space-x-3 py-4">
                          <div className="flex-shrink-0">
                            <span
                              className={classNames(
                                item.iconColor,
                                "inline-flex h-10 w-10 items-center justify-center rounded-lg"
                              )}
                            >
                              <item.icon
                                className="h-6 w-6 text-white"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              <a onClick={() => setDashboardRoute(item.route)}>
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </div>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0 self-center">
                            <ChevronRightIcon
                              className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {dashboardRoute === "overview Giveaways" && user.wallet && (
              <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                <div className="mb-6 rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon
                        className="h-5 w-5 text-yellow-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Attention needed
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Not ready for primetime yet, comeback soon!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {dashboardRoute === "create Giveaway" && user.wallet && (
              <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                <div className="space-y-8 divide-y divide-gray-200">
                  <div className="space-y-8 divide-y divide-gray-200">
                    <div>
                      <div className="mb-6 rounded-md bg-yellow-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <ExclamationTriangleIcon
                              className="h-5 w-5 text-yellow-400"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Attention needed
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p>
                                You can only test it on Polygon Mumbai Testnet,
                                this is not in production yet!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Create Giveaway Tweet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          This information will be displayed publicly so be
                          careful what you share.
                        </p>
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="giveaway-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            GiveAway name
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                              tweet.win/giveaway/
                            </span>
                            <input
                              type="text"
                              autoFocus
                              name="giveaway-name"
                              id="giveaway-name"
                              onChange={(e) => setGiveawayName(e.target.value)}
                              value={giveawayName}
                              autoComplete="giveaway-name"
                              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="erc-20-coin"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Duration
                          </label>
                          <div className="mt-1">
                            <select
                              id="erc-20-coin"
                              name="erc-20-coin"
                              value={giveawayDuration}
                              onChange={(e) =>
                                setGiveawayDuration(parseInt(e.target.value))
                              }
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value={1}>1 days</option>
                              <option value={2}>2 days</option>
                              <option value={3}>3 days</option>
                            </select>
                          </div>
                        </div>

                        <div className=" col-span-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="erc-20-amount"
                              className="flex items-center text-sm font-medium text-gray-700"
                            >
                              Prize amount (1-100
                              <img
                                className="ml-1 h-4"
                                src="/tokens/link.png"
                                alt="$LINK"
                              />{" "}
                              )
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                value={giveawayAmount}
                                onChange={(e) =>
                                  setGiveawayAmount(parseInt(e.target.value))
                                }
                                min="1"
                                max="100"
                                name="erc-20-amount"
                                id="erc-20-amount"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="erc-20-coin"
                              className="block text-sm font-medium text-gray-700"
                            >
                              ERC-20 Coin
                            </label>
                            <div className="mt-1">
                              <select
                                id="erc-20-coin"
                                name="erc-20-coin"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              >
                                <option>Link </option>
                                <option>More ERC-20 tokens coming soon </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        onClick={async () => {
                          const provider = new ethers.providers.Web3Provider(
                            window.ethereum,
                            "any"
                          );
                          // Prompt user for account connections
                          await provider.send("eth_requestAccounts", []);
                          const signer = provider.getSigner();
                          const address = await signer.getAddress();
                          var LinkTokenContract = new ethers.Contract(
                            "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                            LinkABI,
                            signer
                          );

                          const allowance = await LinkTokenContract.allowance(
                            address,
                            "0xF8e78e6b9723f1EeE5209b147C76fCCC727ff652"
                          );
                          if (allowance < BigNumber.from("0x00")) {
                            const tx = await LinkTokenContract.approve(
                              "0xF8e78e6b9723f1EeE5209b147C76fCCC727ff652",
                              "100000000000000000000"
                            );
                            // TODO: not the cleanest solution, but for most approval flows this works good enough
                            if (tx) {
                              toast.success("Approval successful");
                            } else {
                              toast.error("Approval unsuccessful");
                            }
                          } else {
                            toast.success(
                              "Approval already done, you can verify "
                            );
                          }
                        }}
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Approve Giveaway
                      </button>
                      <button
                        onClick={async () => {
                          if (giveawayAmount < 1 || giveawayAmount > 100)
                            return toast.error(
                              "Prize amount not between 1 - 100"
                            );
                          if (!(giveawayDuration in [1, 2, 3]))
                            return toast.error("Duration is not 1,2 or 3 days");
                          if (!giveawayName)
                            return toast.error("Giveaway name is not set");

                          // Fetch to check if name already exist
                          // TODO: return suggestions if already taken
                          const resp = await fetch(
                            `/api/giveaway/${giveawayName}/exist`
                          );
                          const { exist } = await resp.json();
                          if (!!exist)
                            return toast.error(
                              "Name already exist, pick a unique one"
                            );

                          const provider = new ethers.providers.Web3Provider(
                            window.ethereum,
                            "any"
                          );
                          // Prompt user for account connections
                          await provider.send("eth_requestAccounts", []);
                          const signer = provider.getSigner();
                          const address = await signer.getAddress();
                          var LinkTokenContract = new ethers.Contract(
                            "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                            LinkABI,
                            signer
                          );
                          var GiveawayTweetTokenContract = new ethers.Contract(
                            "0xF8e78e6b9723f1EeE5209b147C76fCCC727ff652",
                            GiveawayTweetABI,
                            signer
                          );

                          const allowance = await LinkTokenContract.allowance(
                            address,
                            "0xF8e78e6b9723f1EeE5209b147C76fCCC727ff652"
                          );
                          if (allowance < BigNumber.from("0x00"))
                            return toast.error(
                              "You need to approve the giveaway first"
                            );

                          // hacky amount approach, but it works :)
                          let tx =
                            await GiveawayTweetTokenContract.createGiveaway(
                              giveawayName,
                              `${giveawayAmount}000000000000000000`
                            );

                          // TODO: not the cleanest solution, and definitely need to fix this
                          if (tx) {
                            toast.success(
                              "Giveaway on-chain created successful"
                            );
                            // TODO: create backup solution if this fails
                            const response = await fetch(
                              `/api/giveaway/${giveawayName}`,
                              {
                                method: "POST",
                                body: JSON.stringify({
                                  amount: giveawayAmount,
                                  expiration:
                                    Math.round(Date.now() / 1000) +
                                    giveawayDuration * 24 * 60 * 60,
                                  token: "LINK",
                                }),
                              }
                            );
                            if (response.status == 201) {
                              toast.success(
                                "Giveaway on-chain created successful"
                              );
                              window.location.href = `/giveaways/${giveawayName}`;
                            } else {
                              toast.error(
                                "Something went wrong, contact us through twitter @The_Tweet_Win"
                              );
                            }
                          } else {
                            toast.error("Giveaway created unsuccessful");
                          }
                        }}
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Create Giveaway
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
