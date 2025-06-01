import { Suspense } from "react";
import { ResetPasswordForm } from "../_components/reset-password";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
