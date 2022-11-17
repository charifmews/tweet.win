import { Form } from "@remix-run/react";

export default function LoginFailure() {
  return (
    <div>
      <h1>Login Failure</h1>
      <p>
        Login failed. Please try again.
        <Form method="post" action="/login">
          <button>Login</button>
        </Form>
      </p>
    </div>
  );
}
