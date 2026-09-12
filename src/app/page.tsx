import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/dal";

export default async function Home() {
  const user = await getOptionalUser();
  redirect(user ? "/ficha" : "/login");
}
