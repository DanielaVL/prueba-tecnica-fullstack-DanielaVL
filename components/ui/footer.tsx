import Image from "next/image";

interface FooterProps {
  className?: string;
  fixed?: boolean;
}

export function Footer({ className = "", fixed = false }: FooterProps) {
  return (
    <footer className={`w-full ${fixed ? "absolute bottom-0" : ""} ${className}`}>
      <Image
        src="/footer.jpg"
        alt="Footer"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-36 object-cover"
      />
    </footer>
  );
}