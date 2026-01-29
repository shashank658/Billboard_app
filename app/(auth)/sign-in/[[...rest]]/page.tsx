import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "hsl(201 75% 28%)",
            colorBackground: "hsl(0 0% 100%)",
            colorText: "hsl(224 22% 12%)",
            colorInputBackground: "hsl(32 33% 97%)",
            colorInputText: "hsl(224 22% 12%)",
          },
        }}
        routing="hash"
      />
      <p className="text-center text-xs text-muted-foreground">
        If you need access, ask an admin to invite you.
      </p>
    </div>
  );
}
