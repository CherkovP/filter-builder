const NoInput = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <span className={className}>{children}</span>;
};
export default NoInput;
