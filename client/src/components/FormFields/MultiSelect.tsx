import { CloseIcon, ExclamationIcon } from "../Icons";
export default function MultiSelect({
  items,
  selectedItems,
  errorMultiSelect,
  formTrail,
  className,
  setSelectedItems,
  required,
}: {
  items: string[];
  selectedItems: string[];
  errorMultiSelect: string | null;
  formTrail: boolean;
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  required?: boolean;
}) {
  const filteredItems = items.filter((item) => !selectedItems.includes(item));
  function handleClickAddItemToSelectedItems(item: string) {
    if (selectedItems.length < 5) setSelectedItems([...selectedItems, item]);
  }
  function handleClickDeleteItemFromSelectedItems(currentSelectedItem: string) {
    const selectedItemsWithoutCurrentSelectedItem: string[] =
      selectedItems.filter(
        (selectedItem) => selectedItem !== currentSelectedItem,
      );
    setSelectedItems(selectedItemsWithoutCurrentSelectedItem);
  }
  return (
    <div className={className}>
      <label className="text-secondary font-medium">
        Interests
        {required ? <span className="text-redLight ml-0.5">*</span> : null}
      </label>
      <div
        className={`${formTrail && errorMultiSelect ? "border-redLight" : "border-secondary"} mt-2 flex min-h-13 items-center justify-between gap-3 rounded-lg border-2 p-3`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {selectedItems.length ? (
            selectedItems.map((selectedItem) => (
              <div
                key={selectedItem}
                className="text-secondary bg-blueLight flex items-center rounded-full px-4 py-1 text-sm"
              >
                <span>{selectedItem}</span>
                <button
                  type="button"
                  className="ml-2.5 cursor-pointer rounded-full"
                  onClick={() =>
                    handleClickDeleteItemFromSelectedItems(selectedItem)
                  }
                >
                  <CloseIcon className="fill-secondary h-2.5 w-2.5" />
                </button>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-300 select-none">
              Select your interests
            </span>
          )}
        </div>
        {formTrail && errorMultiSelect ? (
          <ExclamationIcon className="fill-redLight h-5 w-5" />
        ) : null}
      </div>
      {formTrail && errorMultiSelect ? (
        <div className="flex justify-end">
          <span className="text-redLight mt-2 text-sm">{errorMultiSelect}</span>
        </div>
      ) : null}
      <div className="border-secondary text-secondary mt-2 flex flex-wrap gap-2 rounded-lg border-2 p-3">
        {filteredItems.map((item: string) => (
          <button
            key={item}
            type="button"
            className="cursor-pointer rounded-full border-2 px-4 py-1 text-sm hover:bg-gray-100"
            onClick={() => {
              handleClickAddItemToSelectedItems(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
