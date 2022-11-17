// https://api.twitter.com/2/tweets/1591595169761185793/retweeted_by?user.fields=id,profile_image_url,username

import needle from "needle";
// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'

const token = process.env.TWITTER_BEARER_TOKEN;

// You can replace the ID given with the Tweet ID you wish to lookup Retweeting users for
// You can find an ID by using the Tweet lookup endpoint
const id = "1592205142002405376";

export const getRetweets = async (id: string) => {
  const endpointURL = `https://api.twitter.com/2/tweets/${id}/retweeted_by`;
  // These are the parameters for the API request
  // by default, only the Tweet ID and text are returned
  const params = {
    "user.fields": "id,profile_image_url,username", // Edit optional query parameters here
    max_results: 100,
    // "pagination_token": "7140dibdnow9c7btw481sh5y64c9q11u0ydej7dr04ppz"
  };

  // this is the HTTP header that adds bearer token authentication
  const res = await needle("get", endpointURL, params, {
    headers: {
      "User-Agent": "v2RetweetedByUsersJS",
      authorization: `Bearer ${token}`,
    },
  });

  if (res.body) {
    return res.body;
  } else {
    throw new Error("Unsuccessful request");
  }
};
