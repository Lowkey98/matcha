import { ExclamationIcon } from "../Icons";
export default function FormInputField({
  label,
  placeholder,
  className,
  setInputValue,
  errorInput,
  formTrail,
  required,
}: {
  label: string;
  placeholder?: string;
  className?: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  errorInput: string | null;
  formTrail: boolean;
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
        className={`mt-2 flex items-center rounded-lg border-2 pr-3 ${formTrail && errorInput ? "border-redLight" : "border-secondary"}`}
      >
        <input
          type="text"
          placeholder={placeholder}
          className="text-secondary w-full p-3 outline-0 placeholder:text-sm placeholder:text-gray-300"
          onChange={handleChangeInputValue}
        />
        {formTrail && errorInput && (
          <ExclamationIcon className="fill-redLight h-5 w-5" />
        )}
      </div>
      {formTrail && errorInput && (
        <span className="text-redLight float-right mt-2 text-sm">
          {errorInput}
        </span>
      )}
    </div>
  );
}
