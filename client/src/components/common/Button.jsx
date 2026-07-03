const VARIANTS = {
  primary: 'bg-marigold text-ink hover:bg-marigold-dim',
  secondary: 'bg-transparent border border-cream-dim/40 text-cream hover:border-teal hover:text-teal',
  teal: 'bg-teal text-paper hover:bg-teal-dim',
  ink: 'bg-ink text-paper hover:bg-ink/90',
};

export default function Button({
  children,
  variant = 'primary',
  as = 'button',
  className = '',
  ...props
}) {
  const Comp = as;
  return (
    <Comp
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 font-semibold tracking-tight transition-colors duration-150 cursor-pointer ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
