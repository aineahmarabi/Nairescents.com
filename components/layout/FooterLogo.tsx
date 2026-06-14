import Image from "next/image";

export default function FooterLogo() {
  return (
    <Image
      src="/footer-logos/logo-08.png"
      alt="Scents by Naire"
      width={200}
      height={100}
      className="h-24 w-auto object-contain"
    />
  );
}
