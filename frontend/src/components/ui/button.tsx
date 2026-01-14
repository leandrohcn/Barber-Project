interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({ children, isLoading, className, ...props }: ButtonProps) {
  return (
    <button
      disabled={isLoading}
      className={`flex w-full justify-center rounded bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 ${className}`}
      {...props}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}