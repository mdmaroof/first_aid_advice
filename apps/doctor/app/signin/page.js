import { AuthForm } from "@curais/ui";

export const metadata = { title: "Doctor sign in | Curais" };
export default function SignInPage() { return <AuthForm role="doctor" homePath="/" counterpart={{ href: "http://localhost:3000/signin", label: "I’m a patient" }} />; }
