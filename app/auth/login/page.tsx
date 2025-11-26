"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser } from "@/lib/actions/auth";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export const LoginPage = () => {
  const [state, action, pending] = useActionState(loginUser, undefined);
  return (
    <Card className="mt-8 min-w-sm">
      <div className="pb-3 text-2xl font-bold">Login</div>
      <form action={action}>
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          errors={state?.errors.email}
        />
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          errors={state?.errors.password}
          required
        />
        <Button disabled={pending} type="submit">
          Login
        </Button>
        <Link href={"/auth/register"}>
          Don't have an account? <span className="text-blue-400">Sign up Here!</span>
        </Link>
      </form>
    </Card>
  );
};

export default LoginPage;
