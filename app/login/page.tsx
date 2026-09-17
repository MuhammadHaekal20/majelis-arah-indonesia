import { googleCallbackUrl, isGoogleAuthConfigured } from "@/lib/env";
import LoginPage from "./login-form";

export default function Page() {
  return (
    <LoginPage
      googleEnabled={isGoogleAuthConfigured()}
      googleCallbackUrl={googleCallbackUrl()}
    />
  );
}
