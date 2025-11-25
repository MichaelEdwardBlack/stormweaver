"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/actions/auth";
import { MotionButton } from "@/components/MotionButton";

export const RegisterPage = () => {
  const [state, action, pending] = useActionState(registerUser, undefined);
  return (
    <div className="w-full max-w-sm card">
      <div className="pb-3 font-bold text-2xl">Create an Account</div>
      <form action={action}>
        <label>Name</label>
        <input id="name" name="name" />
        {state?.errors?.name && <p className="text-red-400">{state.errors.name}</p>}
        <label>Email</label>
        <input id="email" name="email" />
        {state?.errors?.email && <p className="text-red-400">{state.errors.email}</p>}
        <label>Password</label>
        <input id="password" name="password" type="password" />
        {state?.errors?.password && <p className="text-red-400">{state.errors.password}</p>}
        <label>Confirm Password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" />
        {state?.errors?.confirmPassword && <p className="text-red-400">{state.errors.confirmPassword}</p>}
        <MotionButton
          className="bg-blue-500 mt-4 px-1 py-2 rounded-lg font-semibold text-lg hover:blue-600"
          disabled={pending}
          type="submit"
        >
          Create Account
        </MotionButton>
        <Link href={"/auth/login"}>
          Already have an account? <span className="text-blue-400">Login Here!</span>
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
