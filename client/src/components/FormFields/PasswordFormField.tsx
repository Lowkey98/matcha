import { useState } from "react";
import { ExclamationIcon, EyeCloseIcon, EyeOpenIcon } from "../Icons";
export default function FormInputField({
  label,
  placeholder,
  className,
}: {
  label: string;
  placeholder?: string;
  className?: string;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }
  return (
    <div className={className}>
      <label className="text-secondary font-medium">{label}</label>
      <div className="border-secondary mt-2 flex items-center rounded-lg border-2 pr-3">
        <input
          type={`${showPassword ? "text" : "password"}`}
          placeholder={placeholder}
          className="text-secondary w-full p-3 outline-0 placeholder:text-sm placeholder:text-gray-300"
        />
        {/* <ExclamationIcon className="fill-redLight h-5 w-5" /> */}
        <button
          type="button"
          onClick={handleClickShowPassword}
          className="cursor-pointer rounded-full"
        >
          {showPassword ? (
            <EyeCloseIcon className="fill-secondary h-5 w-5" />
          ) : (
            <EyeOpenIcon className="fill-secondary h-5 w-5" />
          )}
        </button>
      </div>
      {/* <span className="text-redLight float-right mt-2 text-sm">
        Error message
      </span> */}
    </div>
  );
}
