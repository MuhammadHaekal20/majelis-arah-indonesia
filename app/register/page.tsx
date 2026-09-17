import { isGoogleAuthConfigured } from "@/lib/env";
import RegisterForm from "./register-form";

export default function Page() {
  return <RegisterForm googleEnabled={isGoogleAuthConfigured()} />;
}
