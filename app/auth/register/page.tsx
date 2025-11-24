"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import { MotionButton } from "@/app/components/MotionButton";

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  errors: [],
};

export const RegisterPage = () => {
  const [state, formAction, pending] = useActionState(registerUser, initialState);
  return (
    <div className="w-full max-w-sm card">
      <div className="pb-3 font-bold text-2xl">Create an Account</div>
      <form action={formAction}>
        <label>Email</label>
        <input id="email" name="email" />
        <label>Password</label>
        <input id="password" name="password" type="password" />
        <label>Confirm Password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" />
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
