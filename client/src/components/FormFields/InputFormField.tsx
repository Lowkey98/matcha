import { ExclamationIcon } from "../Icons";
export default function FormInputField({
  label,
  placeholder,
  className,
  setInputValue,
  errorInput,
  formTrail,
  type,
  required,
}: {
  label: string;
  placeholder?: string;
  className?: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  errorInput: string | null;
  formTrail: boolean;
  type?: string;
  required?: boolean;
}) {
  function handleChangeInputValue(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }
  return (
    <div className={className}>
      <label className="text-secondary font-medium">
        {label}
        {required ? <span className="text-redLight ml-0.5">*</span> : null}
      </label>
      <div
        className={`mt-2 flex h-13 items-center rounded-lg border-2 ${formTrail && errorInput ? "border-redLight pr-3" : "border-secondary"}`}
      >
        <input
          type={`${type ? type : "text"}`}
          placeholder={placeholder}
          className="text-secondary w-full px-3 outline-0 placeholder:text-sm placeholder:text-gray-300"
          onChange={handleChangeInputValue}
        />
        {formTrail && errorInput && (
          <ExclamationIcon className="fill-redLight h-5 w-5" />
        )}
      </div>
      {formTrail && errorInput && (
        <div className="flex justify-end">
          <span className="text-redLight mt-2 text-sm">{errorInput}</span>
        </div>
      )}
    </div>
  );
}
