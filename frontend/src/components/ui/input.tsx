import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon; // Permite passar um ícone opcional
}

export function Input({ label, icon: Icon, ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
        )}
        <input
          className={`w-full rounded bg-slate-700 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          }`}
          {...props} // Repassa todos os eventos (onChange, value, type)
        />
      </div>
    </div>
  );
}