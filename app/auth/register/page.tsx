"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/actions/auth";
import { MotionButton } from "@/components/MotionButton";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export const RegisterPage = () => {
  const [state, action, pending] = useActionState(registerUser, undefined);
  return (
    <Card className="mt-8 min-w-sm">
      <div className="pb-3 text-2xl font-bold">Create an Account</div>
      <form action={action}>
        <Input
          id="name"
          name="name"
          label="Name"
          placeholder="Kaladin Stormblessed"
          errors={state?.errors?.name}
          required
        />
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          errors={state?.errors?.email}
        />
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          errors={state?.errors?.password}
          required
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          errors={state?.errors?.confirmPassword}
          required
        />
        <Button disabled={pending} type="submit">
          Create Account
        </Button>
        <Link href={"/auth/login"}>
          Already have an account? <span className="text-blue-400">Login Here!</span>
        </Link>
      </form>
    </Card>
  );
};

export default RegisterPage;
