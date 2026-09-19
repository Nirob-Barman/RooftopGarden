import { useEffect, useRef } from "react";

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => Promise<void>;
  disabled?: boolean;
}

export function GoogleLoginButton({
  onSuccess,
  disabled = false,
}: GoogleLoginButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleInitializedRef = useRef(false);

  useEffect(() => {
    if (
      disabled ||
      googleInitializedRef.current ||
      !window.google ||
      !googleButtonRef.current
    ) {
      return;
    }

    googleInitializedRef.current = true;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        if (!response.credential) {
          console.error("Google did not return a credential.");
          return;
        }

        try {
          await onSuccess(response.credential);
        } catch (err) {
          console.error("Google login error:", err);
        }
      },
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: 360,
    });
  }, [disabled, onSuccess]);

  return (
    <div className="flex justify-center">
      <div ref={googleButtonRef} />
    </div>
  );
}
