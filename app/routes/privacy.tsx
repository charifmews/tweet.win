import { Link } from "@remix-run/react";

export default function Privacy() {
  return (
    <div>
      <h1>Privacy policy</h1>
      <ul>
        <li>
          We only store your Twitter User ID, profile name/image and your email. 
          <br />
          We need the twitter user id to link to your Web3 wallet.
          <br />
          We use your profile name/image to show that in our UI or signing message.
          <br />
          We will send an email or tweet to the winner (that's why we need your email)!
        </li>
      </ul>
      <Link to={"/"}>Bank to home</Link>
    </div>
  );
}
