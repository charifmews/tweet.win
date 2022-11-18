import { Header } from "~/components/website/Header";
import { Footer } from "~/components/website/Footer";

export default function Privacy() {
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
                Privacy Policy
              </h1>
            </div>
          </div>
          <div className="relative">
            <div className="relative md:bg-white md:p-6">
              <div className="lg:grid lg:grid-cols-2 lg:gap-6">
                <div className="prose-lg prose prose-indigo text-gray-500 lg:max-w-none">
                  <p>
                    We only store your Twitter User ID, profile name/image and
                    your email. The Twitter user ID is used to link you to your
                    Web3 wallet. This makes it possible to payout if you win the
                    giveaway prize!
                  </p>
                  <p>
                    For our app we use your profile name/image to show that in
                    our UI. We will send an email and/or a tweet to the winner
                    (that's why we need your email)!
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
