"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MotionButton } from "@/components/MotionButton";
import { loginUser } from "@/lib/actions/auth";

export const LoginPage = () => {
  const [state, action, pending] = useActionState(loginUser, undefined);
  return (
    <div className="w-full max-w-sm card">
      <div className="pb-3 font-bold text-2xl">Login</div>
      <form action={action}>
        <label>Email</label>
        <input id="email" name="email" />
        {state?.errors?.email && <p className="text-red-400">{state.errors.email}</p>}
        <label>Password</label>
        <input id="password" name="password" type="password" />
        {state?.errors?.password && <p className="text-red-400">{state.errors.password}</p>}
        <MotionButton
          className="bg-blue-500 mt-4 px-1 py-2 rounded-lg font-semibold text-lg hover:blue-600"
          disabled={pending}
          type="submit"
        >
          Login
        </MotionButton>
        <Link href={"/auth/register"}>
          Don't have an account? <span className="text-blue-400">Sign up Here!</span>
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
