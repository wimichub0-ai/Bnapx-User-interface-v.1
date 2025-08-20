import Image from "next/image";

const icons = {
  usdt: "/icons/usdt.png",
  btc: "/icons/btc.png",
  itunes: "/icons/itunes.png",
  gift: "/icons/gift.png",
};

export default function CryptoIcon({ type, size = 40, alt = "" }) {
  const src = icons[type];
  if (!src) return <span>❓</span>;
  return <Image src={src} alt={alt || type.toUpperCase()} width={size} height={size} />;
}
