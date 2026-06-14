import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0B3D33 0%, #081f1a 100%)" }}
    >
      <div className="text-center mb-8">
        <Image
          src="/logo-main.png"
          alt="Naire Scents"
          width={180}
          height={72}
          className="h-16 w-auto object-contain mx-auto mb-4"
          priority
        />
        <p className="text-white/40 text-sm">Admin Dashboard</p>
      </div>

      <SignIn
        routing="hash"
        forceRedirectUrl="/admin/dashboard"
        signUpUrl="/admin/login"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white/5 border border-white/10 shadow-2xl rounded-2xl",
            headerTitle: "text-white font-semibold",
            headerSubtitle: "text-white/40",
            socialButtonsBlockButton: "border border-white/15 text-white hover:bg-white/5",
            socialButtonsBlockButtonText: "text-white",
            dividerLine: "bg-white/10",
            dividerText: "text-white/30",
            formFieldLabel: "text-white/60",
            formFieldInput:
              "bg-white/5 border border-white/15 text-white placeholder:text-white/20 focus:border-[#C9A96E] rounded-xl",
            formButtonPrimary:
              "bg-[#C9A96E] text-[#0B3D33] font-semibold hover:opacity-90 rounded-xl",
            footerActionLink: "hidden",
            footer: "hidden",
            identityPreviewText: "text-white",
            identityPreviewEditButtonIcon: "text-white/40",
          },
          variables: {
            colorBackground: "transparent",
            colorPrimary: "#C9A96E",
            borderRadius: "0.75rem",
          },
        }}
      />

      <p className="text-center text-white/20 text-xs mt-6">Authorized access only</p>
    </div>
  );
}
