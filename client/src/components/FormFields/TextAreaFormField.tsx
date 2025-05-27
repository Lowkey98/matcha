import { ExclamationIcon } from "../Icons";
export default function TextAreaFormField({
  label,
  placeholder,
  className,
  setTextAreaValue,
  errorTextArea,
  formTrail,
  required,
}: {
  label: string;
  placeholder?: string;
  className?: string;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string>>;
  errorTextArea: string | null;
  formTrail: boolean;
  required?: boolean;
}) {
  function handleChangeTextAreaValue(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setTextAreaValue(event.target.value);
  }
  return (
    <div className={className}>
      <label className="text-secondary font-medium">
        {label}
        {required ? <span className="text-redLight ml-0.5">*</span> : null}
      </label>
      <div
        className={`relative mt-2 rounded-lg border-2 ${formTrail && errorTextArea ? "border-redLight pr-3" : "border-secondary"}`}
      >
        <textarea
          className="text-secondary h-32 w-full p-3 outline-none placeholder:text-sm placeholder:text-gray-300"
          placeholder={placeholder}
          onChange={handleChangeTextAreaValue}
        ></textarea>
        {formTrail && errorTextArea && (
          <ExclamationIcon className="fill-redLight absolute top-3 right-3 h-5 w-5" />
        )}
      </div>
      {formTrail && errorTextArea && (
        <div className="flex justify-end">
          <span className="text-redLight mt-2 text-sm">{errorTextArea}</span>
        </div>
      )}
    </div>
  );
}
