import { AuthForm } from "@/components/AuthForm";
import { login } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <AuthForm
      action={login}
      heading="Log in to W3"
      submitLabel="Log in"
      altHref="/signup"
      altLabel="Need an account? Sign up"
      showForgotPassword
    />
  );
}
