"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MotionButton } from "@/app/components/MotionButton";
import { loginUser } from "@/app/actions/auth";

const initialState = {
  email: "",
  password: "",
  errors: [],
};

export const LoginPage = () => {
  const [state, formAction, pending] = useActionState(loginUser, initialState);
  return (
    <div className="w-full max-w-sm card">
      <div className="pb-3 font-bold text-2xl">Login</div>
      <form action={formAction}>
        <label>Email</label>
        <input id="email" name="email" />
        <label>Password</label>
        <input id="password" name="password" type="password" />
        <ul className="text-red-400">
          {state?.errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
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
