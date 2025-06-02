import { useState } from "react";
import { ExclamationIcon, ArrowDownIcon, ArrowUpIcon } from "../Icons";
export default function DropdownFormField({
  label,
  placeholder,
  className,
  setDropdownValue,
  dropdownValue,
  errorDropdown,
  formTrail,
  items,
  required,
}: {
  label: string;
  placeholder?: string;
  className?: string;
  formTrail: boolean;
  setDropdownValue: React.Dispatch<React.SetStateAction<string>>;
  dropdownValue: string;
  errorDropdown: string | null;
  items: string[];
  required?: boolean;
}) {
  const [showItems, setShowItems] = useState<boolean>(false);
  function handleCLickDropdown() {
    setShowItems(!showItems);
  }
  function handleClickDropdownItem(event: React.MouseEvent<HTMLButtonElement>) {
    if (event.currentTarget.textContent)
      setDropdownValue(event.currentTarget.textContent);
    setShowItems(false);
  }
  return (
    <div className={className}>
      <label className="text-secondary font-medium">
        {label}
        {required ? <span className="text-redLight ml-0.5">*</span> : null}
      </label>
      <div className="relative">
        <button
          type="button"
          className={`mt-2 flex h-13 w-full cursor-pointer items-center justify-between rounded-lg border-2 px-3 ${errorDropdown && formTrail ? "border-redLight" : "border-secondary"}`}
          onClick={handleCLickDropdown}
        >
          {dropdownValue.length ? (
            <span className="text-secondary">{dropdownValue}</span>
          ) : (
            <span className="text-sm text-gray-300">{placeholder}</span>
          )}
          <div className="flex items-center gap-1.5">
            {showItems ? (
              <ArrowUpIcon className="fill-secondary h-4.5 w-4.5" />
            ) : (
              <ArrowDownIcon className="fill-secondary h-4.5 w-4.5" />
            )}
            {errorDropdown && formTrail ? (
              <ExclamationIcon className="fill-redLight h-5 w-5" />
            ) : null}
          </div>
        </button>
        {showItems ? (
          <div className="border-secondary text-secondary absolute z-1 mt-2 max-h-52 w-full overflow-auto rounded-lg border-2 bg-white">
            {items.map((item) => (
              <button
                type="button"
                key={item}
                className="w-full cursor-pointer p-3 text-left hover:bg-gray-50"
                onClick={handleClickDropdownItem}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {errorDropdown && formTrail ? (
        <div className="flex justify-end">
          <span className="text-redLight mt-2 text-sm">{errorDropdown}</span>
        </div>
      ) : null}
    </div>
  );
}
