import Link from "next/link";

export const TrackedLink = ({
  href,
  children,
  phData = {},
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  phData?: Record<string, any>;
}) => {
  // data-ph-capture-attribute-{key}={value}
  const prefixedData = Object.entries(phData)
    .map(([key, value]) => [`data-ph-capture-attribute-${key}`, value])
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  return (
    <Link href={href} passHref legacyBehavior>
      <a {...props} {...prefixedData}>
        <span className="pointer-events-none">{children}</span>
      </a>
    </Link>
  );
};
