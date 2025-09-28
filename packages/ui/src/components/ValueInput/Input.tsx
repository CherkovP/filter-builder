const Input = ({
  className,
  onChange,
  onBlur,
  value,
  type,
  ariaLabel,
  placeholder,
}: {
  type: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  className?: string;
  placeholder?: string;
  value?: string | number;
}) => {
  return (
    <input
      aria-label={ariaLabel}
      type={type}
      value={value ?? ""}
      onBlur={(e) =>
        onBlur &&
        onBlur(
          type === "number" ? (e.target.valueAsNumber as any) : e.target.value
        )
      }
      placeholder={placeholder}
      className={className || "border border-gray-300 rounded px-2 py-1"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Input;
