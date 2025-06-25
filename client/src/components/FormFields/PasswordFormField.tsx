import { useState } from "react";
import { ExclamationIcon, EyeCloseIcon, EyeOpenIcon } from "../Icons";
export default function PasswordFormField({
  label,
  placeholder,
  className,
  setPasswordValue,
  errorPassword,
  setErrorPassword,
  required,
}: {
  label: string;
  placeholder?: string;
  className?: string;
  setPasswordValue: React.Dispatch<React.SetStateAction<string>>;
  errorPassword: string | null;
  setErrorPassword: React.Dispatch<React.SetStateAction<string | null>>;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }
  function handleFocusInputPassword() {
    setErrorPassword(null);
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
        className={`mt-2 flex h-13 items-center rounded-lg border-2 pr-3 ${errorPassword ? "border-redLight" : "border-secondary"}`}
      >
        <input
          type={`${showPassword ? "text" : "password"}`}
          placeholder={placeholder}
          className="text-secondary w-full px-3 outline-0 placeholder:text-sm placeholder:text-gray-300"
          onChange={handleChangePasswordValue}
          onFocus={handleFocusInputPassword}
        />
        {errorPassword ? (
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
      {errorPassword ? (
        <div className="flex justify-end">
          <span className="text-redLight mt-2 text-sm">{errorPassword}</span>
        </div>
      ) : null}
    </div>
  );
}
