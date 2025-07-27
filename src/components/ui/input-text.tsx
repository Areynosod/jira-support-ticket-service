import { FC } from "hono/jsx";

interface InputProps {
  label: string;
  name: string;
  value?: string;
  placeholder: string;
  type: string;
  error?: boolean;
}
export const Input: FC<InputProps> = ({
  label,
  name,
  placeholder,
  type,
  value,
  error,
}) => {
  return (
    <div className="flex flex-col my-4">
      <label className="text-sm font-bold mb-1 text-gray-500">
        {label} {error && <span className="error-color">*</span>}
      </label>
      <input
        value={value}
        className={`border-2 border-gray-300 rounded-md px-2 py-1 bg-white ${
          error ? "border-red-300" : ""
        }`}
        type={type}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
};
