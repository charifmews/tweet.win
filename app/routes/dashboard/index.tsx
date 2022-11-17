import React, { useState } from "react";
import { ethers } from "ethers";

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
  { name: "Dashboard", route: "onboarding" },
  { name: "GiveAways Overview", route: "overview GiveAways" },
  { name: "Create GiveAway", route: "create GiveAway" },
  { name: "Your GiveAways", route: "your GiveAways" },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Sign out", href: "/logout" },
];

const actions = [
  {
    title: "Request time off",
    href: "#",
  },
  {
    title: "Benefits",
    href: "#",
  },
  {
    title: "Schedule a one-on-one",
    href: "#",
  },
  {
    title: "Payroll",
    href: "#",
  },
  {
    title: "Submit an expense",
    href: "#",
  },
  {
    title: "Training",
    href: "#",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const { user } = useLoaderData<LoaderData>();
  const [dashboardRoute, setDashboardRoute] = useState<string>("onboarding");
  
  return (
    <>
      <div className="min-h-full">
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
                            {navigation.map((item) => (
                              <a
                                key={item.name}
                                onClick={() => setDashboardRoute(item.route)}
                                className={classNames(
                                  dashboardRoute === item.route
                                    ? "bg-blue-900 text-white"
                                    : "text-blue-300 hover:bg-blue-700 hover:text-white",
                                  "cursor-pointer rounded-md px-3 py-2 text-sm font-medium"
                                )}
                                aria-current={
                                  dashboardRoute === item.route
                                    ? "page"
                                    : undefined
                                }
                              >
                                {item.name}
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
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
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
            {dashboardRoute === "onboarding" && !user.wallet && (
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
                        console.log(address);

                        const signature = await signer.signMessage(
                          user.id.toString()
                        );
                        fetch("/api/profile", {
                          method: "POST",
                          body: JSON.stringify({
                            signature,
                            address,
                          }),
                        });
                      }}
                      className="inline-flex items-center rounded-full border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      🔗 Link Wallet with {user.name}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {dashboardRoute === "onboarding" && user.wallet && (
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
                        route: "create GiveAway",
                        iconColor: "bg-purple-500",
                        icon: MegaphoneIcon,
                      },
                      {
                        name: "GiveAways",
                        description:
                          "See all GiveAway tweets and retweet if you like them",
                        route: "overview GiveAways",
                        iconColor: "bg-blue-500",
                        icon: GiftIcon,
                      },
                    ].map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <div className="group relative flex items-start space-x-3 py-4 cursor-pointer">
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
            {dashboardRoute === "overview GiveAways" && user.wallet && (
              <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                  {actions.map((action, actionIdx) => (
                    <div
                      key={action.title}
                      className={classNames(
                        actionIdx === 0
                          ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                          : "",
                        actionIdx === 1 ? "sm:rounded-tr-lg" : "",
                        actionIdx === actions.length - 2
                          ? "sm:rounded-bl-lg"
                          : "",
                        actionIdx === actions.length - 1
                          ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                          : "",
                        "group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
                      )}
                    >
                      <div>
                        <span className="inline-flex rounded-lg p-3 ring-4 ring-white"></span>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-lg font-medium">
                          <a href={action.href} className="focus:outline-none">
                            {/* Extend touch target to entire panel */}
                            <span
                              className="absolute inset-0"
                              aria-hidden="true"
                            />
                            {action.title}
                          </a>
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Doloribus dolores nostrum quia qui natus officia quod
                          et dolorem. Sit repellendus qui ut at blanditiis et
                          quo et molestiae.
                        </p>
                      </div>
                      <span
                        className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                        aria-hidden="true"
                      >
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                        </svg>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dashboardRoute === "create GiveAway" && user.wallet && (
              <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                <form className="space-y-8 divide-y divide-gray-200">
                  <div className="space-y-8 divide-y divide-gray-200">
                    <div>
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
                            htmlFor="username"
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
                              name="username"
                              id="username"
                              autoComplete="username"
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
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option>2 days</option>
                              <option>4 days</option>
                              <option>6 days</option>
                              <option>8 days</option>
                              <option>10 days</option>
                              <option>12 days</option>
                            </select>
                          </div>
                        </div>

                        <div className=" grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 col-span-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="erc-20-amount"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Prize amount
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
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
                              <option>Polygon</option>
                              <option>Ethereum</option>
                              <option>Link</option>
                              <option>Bitcoin</option>
                            </select>
                          </div>
                        </div>
                      </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Thumbnail
                          </label>
                          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">

                          </div>
                        </div> 
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">

                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Create GiveAway
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
