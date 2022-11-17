import { Link } from "@remix-run/react";

export default function TOS() {
  return (
    <div>
      <h1>Terms of Service</h1>
      <ul>
        <li>
          You cannot create illegal giveaways and we can block them if needed. 
        </li>
      </ul>
      <Link to={"/"}>Bank to home</Link>
    </div>
  );
}
