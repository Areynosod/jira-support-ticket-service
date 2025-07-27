import { FC } from "hono/jsx";

interface SelectProps {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

export const Select: FC<SelectProps> = ({
  label,
  name,
  options,
  placeholder = "Select an option",
  error,
}) => {
  return (
    <div className="flex flex-col my-4">
      <label className="text-sm font-bold mb-1 text-gray-500">
        {label} {error && <span className="error-color">*</span>}
      </label>
      <select
        required={false}
        className={`border-2 border-gray-300 rounded-md px-2 py-1 bg-white ${
          error ? "border-red-300" : ""
        }`}
        name={name}
      >
        <option value="" disabled selected>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
