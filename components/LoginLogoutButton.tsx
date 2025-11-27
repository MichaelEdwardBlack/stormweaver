import Link from "next/link";
import { Button } from "./ui/buttons/Button";
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
        variant="solid"
        onClick={() => {
          signOut();
          onClick?.();
        }}
      >
        Log Out
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
