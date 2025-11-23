import Link from "next/link";
import AuthForm from "@/app/ui/AuthForm";

export default function Login() {
  return (
    <>
      <h1>Login</h1>
      <AuthForm submitText={"Log In"}/>
      <br />
      <Link href="/signup">To Signup Page</Link>
    </>
  );
}