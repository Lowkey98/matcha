import ButtonPrimary from '../Buttons/ButtonPrimary';
import { ExclamationIcon, LocationIcon } from '../Icons';
export default function FormInputField({
  className,
  setLocationValue,
}: {
  className?: string;
  setLocationValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={className}>
      <label className="text-secondary font-medium">GPS position</label>
      <div className="border-grayDark-100 mt-2 flex h-13 items-center justify-between rounded-lg border-2 px-3">
        <div className="flex items-center gap-1">
          <LocationIcon className="fill-primary h-5 w-5" />
          <span className="text-secondary">Rue 02 zarktouni</span>
        </div>
        <ButtonPrimary
          type="button"
          value="Edit"
          className="h-auto py-1 w-20 text-sm"
        />
      </div>
    </div>
  );
}
