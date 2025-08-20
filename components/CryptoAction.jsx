import Link from "next/link";
import CryptoIcon from "./CryptoIcon";

export default function CryptoAction({ type, label, href }) {
  return (
    <Link
      href={href || "#"}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow hover:shadow-md transition"
      style={{ width: 120 }}
    >
      <CryptoIcon type={type} size={60} />
      <span className="mt-2 text-sm font-semibold text-slate-800">{label}</span>
    </Link>
  );
}
