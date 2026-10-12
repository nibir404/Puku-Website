import Image from "next/image";

export function Logo({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/img/logo.svg"
      alt="Puku"
      width={size}
      height={Math.round((size * 48) / 38)}
      priority
      className={`dark:invert-0 ${className}`}
    />
  );
}
