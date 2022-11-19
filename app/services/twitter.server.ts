import needle from "needle";

const token = process.env.TWITTER_BEARER_TOKEN;

export const getRetweets = async (tweetId: string, pagination_token = "") => {
  console.log(tweetId)
  const endpointURL = `https://api.twitter.com/2/tweets/${tweetId}/retweeted_by`;
  console.log(endpointURL)
  // These are the parameters for the API request
  // by default, only the Tweet ID and text are returned
  const params = {
    "user.fields": "id,profile_image_url,username", 
    max_results: 100,
  };

  if (pagination_token) params.pagination_token = pagination_token

  // this is the HTTP header that adds bearer token authentication
  const res = await needle("get", endpointURL, params, {
    headers: {
      "User-Agent": "v2RetweetedByUsersJS",
      authorization: `Bearer ${token}`,
    },
  });

  if (res.body) {
    return res.body
  } else {
    throw new Error("Unsuccessful request");
  }
};

export const getTweet = async (id: string) => {
  const endpointURL = `https://api.twitter.com/2/tweets/${id}`;
  // These are the parameters for the API request
  // by default, only the Tweet ID and text are returned
  const params = {};

  // this is the HTTP header that adds bearer token authentication
  const res = await needle("get", endpointURL, params, {
    headers: {
      "User-Agent": "v2TweetJS",
      authorization: `Bearer ${token}`,
    },
  });

  if (res.body) {
    return res.body;
  } else {
    throw new Error("Unsuccessful request");
  }
};
