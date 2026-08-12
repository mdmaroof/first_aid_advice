import { AuthForm } from "@curais/ui";

export const metadata = { title: "Patient sign in | Curais" };
export default function SignInPage({ searchParams }) {
  return <AuthForm role="patient" homePath="/patient" initialMode={searchParams?.mode} counterpart={{ href: "http://localhost:3001/signin", label: "I’m a doctor" }} />;
}
