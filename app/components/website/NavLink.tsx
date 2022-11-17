import { Link } from "@remix-run/react";

export function NavLink({ href, children }: { href: string; children: any }) {
  return (
    <Link
      to={href}
      className="inline-block rounded-lg py-1 px-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  );
}
