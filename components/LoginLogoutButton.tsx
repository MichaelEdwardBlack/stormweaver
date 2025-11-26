import Link from "next/link";
import { Button } from "./Button";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const LoginLogoutButton = ({ onClick }: { onClick?: () => void }) => {
  const { data: session, update } = useSession();
  const path = usePathname();
  useEffect(() => {
    update();
  }, [path]);
  if (session) {
    return (
      <Button
        onClick={() => {
          signOut();
          onClick?.();
        }}
      >
        Logout
      </Button>
    );
  } else {
    return (
      <Link href="/auth/login" onClick={onClick}>
        <Button>Login</Button>
      </Link>
    );
  }
};
