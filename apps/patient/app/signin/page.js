import { AuthForm } from "@curais/ui";

export const metadata = { title: "Patient sign in | Curais" };
export default function SignInPage({ searchParams }) {
  const requestedPath = typeof searchParams?.next === "string" ? searchParams.next : "";
  const homePath = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/patient";
  return <AuthForm role="patient" homePath={homePath} initialMode={searchParams?.mode} counterpart={{ href: "http://localhost:3001/signin", label: "I’m a doctor" }} />;
}
