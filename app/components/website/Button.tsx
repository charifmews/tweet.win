import { Link } from "@remix-run/react";
import clsx from "clsx";

const baseStyles: { solid: string; outline: string } = {
  solid:
    "group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
  outline:
    "group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none",
};

const variantStyles: {
  solid: { slate: string; blue: string; white: string; sky: string };
  outline: { slate: string; white: string; blue: string; sky: string };
} = {
  solid: {
    slate:
      "bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900",
    blue: "bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600",
    white:
      "bg-white text-slate-900 hover:bg-blue-50 active:bg-blue-200 active:text-slate-600 focus-visible:outline-white",
    sky: "bg-sky-600 text-white hover:text-slate-100 hover:bg-sky-500 active:bg-sky-800 active:text-sky-100 focus-visible:outline-sky-600",
  },
  outline: {
    slate:
      "ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300",
    white:
      "ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white",
    sky: "ring-sky-700 text-sky-700 hover:ring-sky-500 active:ring-sky-700 active:text-sky-400 focus-visible:outline-white",

    blue: "",
  },
};

export function Button({
  variant = "solid",
  color = "slate",
  className,
  href,
  ...props
}: {
  variant: "solid" | "outline";
  color: "slate" | "blue" | "white" | "sky";
  className: string;
  href?: string;
  onClick?: () => void;
  children: any;
}) {
  className = clsx(
    baseStyles[variant],
    variantStyles[variant][color],
    className
  );

  return href ? (
    <Link to={href} className={className} {...props} />
  ) : (
    <button className={className} {...props} />
  );
}
