import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NameInput } from "./NameInput";

export default async function NamePage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return <NameInput />;
}
