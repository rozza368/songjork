import Link from "next/link";
import AuthForm from "@/app/ui/AuthForm";

export default function Signup() {
  return (
    <>
      <h1>Sign Up</h1>
      <AuthForm submitText={"Sign Up"}/>
      <br />
      <Link href="/login">To Login Page</Link>
    </>
  );
}