import { ExclamationIcon } from "../Icons";
export default function FormInputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-secondary font-medium">{label}</label>
      <div className="border-secondary mt-2 flex items-center rounded-lg border-2 pr-3">
        <input
          type="text"
          placeholder={placeholder}
          className="text-secondary w-full p-3 outline-0 placeholder:text-sm placeholder:text-gray-300"
        />
        {/* <ExclamationIcon className="fill-redLight h-5 w-5" /> */}
      </div>
      {/* <span className="text-redLight float-right mt-2 text-sm">
        Error message
      </span> */}
    </div>
  );
}
