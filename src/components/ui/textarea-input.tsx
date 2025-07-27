import { FC } from "hono/jsx";

interface InputTextProps {
  label: string;
  name: string;
  placeholder: string;
  type: string;
  minHeight?: string;
  error?: boolean;
}
export const TextArea: FC<InputTextProps> = ({
  label,
  name,
  placeholder,
  type,
  minHeight = "180px",
  error,
}) => {
  return (
    <div className="flex flex-col my-4">
      <label className="text-sm font-bold mb-1 text-gray-500">
        {label} {error && <span className="error-color">*</span>}
      </label>
      <textarea
        required={false}
        minLength={10}
        style={{ minHeight: minHeight }}
        className={`bg-white border-2 border-gray-300 rounded-md px-2 py-1 ${
          error ? "border-red-300" : ""
        }`}
        type={type}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
};
