import { Link } from 'react-router-dom';

export default function DisabledInputFormField({
  label,
  placeholder,
  className,
  defaultValue,
  required,
}: {
  label: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <label className="text-secondary font-medium">
        {label}
        {required ? <span className="text-redLight ml-0.5">*</span> : null}
      </label>
      <div className="border-secondary mt-2 flex h-13 cursor-not-allowed items-center rounded-lg border-2 bg-gray-100">
        <input
          type="text"
          placeholder={placeholder}
          className="text-secondary w-full px-3 outline-0 placeholder:text-sm placeholder:text-gray-300"
          value={defaultValue}
          disabled
        />
      </div>
      <div className="mt-1 flex justify-end">
        <Link
          to="/updateEmail"
          className="text-secondary border-b-2 pb-1 text-sm"
        >
          update your email
        </Link>
      </div>
    </div>
  );
}
