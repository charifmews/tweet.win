import clsx from "clsx";

export function Container({
  className,
  style,
  ...props
}: {
  className: string;
  style?: any;
  children: any;
}) {
  return (
    <div
      className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      style={style}
      {...props}
    />
  );
}
