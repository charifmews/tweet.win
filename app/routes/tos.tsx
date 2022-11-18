import { Header } from "~/components/website/Header";
import { Footer } from "~/components/website/Footer";

export default function TOS() {
  return (
    <div>
      <Header />
      <div
        className="overflow-hidden bg-white py-16 px-4 sm:px-6 lg:px-8"
        style={{
          minHeight: `calc(100vh - 220px)`,
        }}
      >
        <div className="mx-auto max-w-max lg:max-w-7xl">
          <div className="relative z-10 mb-8 md:mb-2 md:px-6">
            <div className="max-w-prose text-base lg:max-w-none">
              <h1 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
                Terms of Service
              </h1>
            </div>
          </div>
          <div className="relative">
            <div className="relative md:bg-white md:p-6">
              <div className="lg:grid lg:grid-cols-2 lg:gap-6">
                <div className="prose-lg prose prose-indigo text-gray-500 lg:max-w-none">
                  <p>
                    This is created by a Dutch developer so that means at least
                    the EU law will apply to this app. Also the smart contracts
                    are not audited yet, so use this at your own risk! If you
                    bring any harm to the app by example polluting our database
                    or try to scrape the website we can block you from our
                    frontend app. In theory you could still create giveaway
                    tweets on our smart contract, but it will be stuck in the
                    smart contract forever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
