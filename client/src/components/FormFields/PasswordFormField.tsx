import { useState } from "react";
import { ExclamationIcon, EyeCloseIcon, EyeOpenIcon } from "../Icons";
export default function FormInputField({
  label,
  placeholder,
  className,
  setPasswordValue,
  errorPassword,
  formTrail,
  required,
}: {
  label: string;
  placeholder?: string;
  className?: string;
  setPasswordValue: React.Dispatch<React.SetStateAction<string>>;
  errorPassword: string | null;
  formTrail: boolean;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }
  function handleChangePasswordValue(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setPasswordValue(event.target.value);
  }
  return (
    <div className={className}>
      <label className="text-secondary font-medium">
        {label}
        {required ? <span className="text-redLight ml-0.5">*</span> : null}
      </label>
      <div
        className={`mt-2 flex items-center rounded-lg border-2 pr-3 ${formTrail && errorPassword ? "border-redLight" : "border-secondary"}`}
      >
        <input
          type={`${showPassword ? "text" : "password"}`}
          placeholder={placeholder}
          className="text-secondary w-full p-3 outline-0 placeholder:text-sm placeholder:text-gray-300"
          onChange={handleChangePasswordValue}
        />
        {formTrail && errorPassword ? (
          <ExclamationIcon className="fill-redLight h-5 w-5" />
        ) : (
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
        )}
      </div>
      {formTrail && errorPassword ? (
        <span className="text-redLight float-right mt-2 text-sm">
          {errorPassword}
        </span>
      ) : null}
    </div>
  );
}
