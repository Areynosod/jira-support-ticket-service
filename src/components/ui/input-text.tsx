import { FC } from "hono/jsx";

interface InputProps {
  label: string;
  name: string;
  value?: string;
  placeholder: string;
  type: string;
}
export const Input: FC<InputProps> = ({
  label,
  name,
  placeholder,
  type,
  value,
}) => {
  return (
    <div className="flex flex-col my-4">
      <label className="text-sm font-bold mb-1 text-gray-500">{label}</label>
      <input
        value={value}
        className="border-2 border-gray-300 rounded-md px-2 py-1 bg-white"
        type={type}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
};
