import { Logo } from "./Logo";
import { Button } from "./Button";
import { Container } from "./Container";
import ChainLinkLogo from "~/images/logos/chainlink.svg";
import PolygonLogo from "~/images/logos/polygon.svg";
import FilecoinLogo from "~/images/logos/filecoin.svg";
import { Form } from "@remix-run/react";

export function Hero() {
  return (
    <Container
      className="flex flex-col items-center justify-center pb-16 text-center lg:pt-12"
      style={{
        minHeight: `calc(100vh - 220px)`,
      }}
    >
      <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        <Logo className="mb-4 h-20" />
        Tweet.
        <span className="relative whitespace-nowrap text-sky-600">Win</span>
        <span className="position absolute rounded-full bg-red-200  px-2 text-base tracking-normal">
          Beta
        </span>
        <br />
      </h1>
      <h2 className="font-display mx-auto mt-2 max-w-4xl text-[26px] font-medium tracking-tight text-sky-800">
        Trustless Giveaway Tweets
      </h2>
      <p className="mx-auto mt-6 max-w-md text-lg tracking-tight text-slate-700">
        Never trust a giveaway tweet anymore! <br />
        Our giveaways are cryptographically fair 😇
        <br />
        Creating a tweet giveaway is under 1 dollar! <br />
        Only scammers wouldn't pay that 🤩
      </p>
      <div className="mx-auto mt-8 flex max-w-xs flex-col items-center justify-center gap-y-6">
        <Form method="post" action="/login">
          <Button variant="solid" color="sky" className="py-2 px-[20px]">
            Link profile or create giveaway tweet
          </Button>
        </Form>
        <Button
          color="sky"
          className=""
          variant="outline"
          onClick={() =>
            window.open("https://vimeo.com/user189005215/tweet-win", "_blank")
          }
        >
          <svg
            aria-hidden="true"
            className="h-3 w-3 flex-none fill-sky-600 group-active:fill-current"
          >
            <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
          </svg>
          <span className="ml-3">Or watch video to see how it works</span>
        </Button>
      </div>
      <div className="mt-8 lg:mt-12">
        <p className="font-display text-base text-slate-900">Powered by</p>
        <ul
          role="list"
          className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
        >
          {[
            [
              {
                name: "Polygon",
                logo: PolygonLogo,
              },
              { name: "ChainLink", logo: ChainLinkLogo },
              { name: "Filecoin", logo: FilecoinLogo },
            ],
          ].map((group, groupIndex) => (
            <li key={groupIndex}>
              <ul
                role="list"
                className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
              >
                {group.map((company) => (
                  <li key={company.name} className="flex items-center">
                    <img src={company.logo} alt={company.name} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
