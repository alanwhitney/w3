import { AuthForm } from "@/components/AuthForm";
import { signup } from "@/app/auth/actions";

export default function SignupPage() {
  return (
    <AuthForm
      action={signup}
      heading="Create your W3 account"
      submitLabel="Sign up"
      altHref="/login"
      altLabel="Already have an account? Log in"
    />
  );
}
