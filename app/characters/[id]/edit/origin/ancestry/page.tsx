import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AncestryPicker } from "./components/AncestryPicker";

export default async function OriginPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return <AncestryPicker />;
}
