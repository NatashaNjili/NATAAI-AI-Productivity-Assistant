import logo from "@/assets/nata-brand.png";

interface Props {
  className?: string;
  size?: number;
}

export function NataLogo({ className = "", size = 36 }: Props) {
  return (
    <img
      src={logo}
      alt="NATA — Neural AI Task Assistant"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain", height: size, width: "auto" }}
    />
  );
}
