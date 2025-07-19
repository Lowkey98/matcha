import { useEffect, useState } from 'react';
import { UserLocation } from '../../../../shared/types';
import ButtonPrimary from '../Buttons/ButtonPrimary';
import { CloseIcon, LocationIcon } from '../Icons';
import { Map, Marker } from 'pigeon-maps';
import { getAddress } from '../../../Api';
import { useToast } from '../../hooks/useToast';
export default function FormInputField({
  location,
  setLocation,
  className,
}: {
  location: UserLocation;
  setLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
  className?: string;
}) {
  const [position, setPosition] = useState<[number, number]>([
    location.latitude,
    location.longitude,
  ]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const { addToast } = useToast();
  function handleClickEditLocation() {
    setShowMap(true);
  }
  function handleClickOnMap({ latLng }: { latLng: [number, number] }) {
    getAddress({ latitude: latLng[0], longitude: latLng[1] })
      .then((address: string) => {
        const userLocation: UserLocation = {
          address,
          latitude: latLng[0],
          longitude: latLng[1],
        };
        setLocation(userLocation);
        setPosition(latLng);
      })
      .catch((error) => {
        addToast({
          status: 'error',
          message: error,
        });
      });
  }
  function handleClickCloseMap() {
    setShowMap(false);
  }
  return (
    <div className={className}>
      <label className="text-secondary font-medium">GPS position</label>
      <div className="border-grayDark-100 mt-2 flex h-13 items-center justify-between rounded-lg border-2 px-3">
        <div className="flex items-center gap-1">
          <LocationIcon className="fill-primary h-5 w-5" />
          <span className="text-secondary">{location?.address}</span>
        </div>
        <ButtonPrimary
          type="button"
          value="Edit"
          className="h-auto w-20 py-1 text-sm"
          onClick={handleClickEditLocation}
        />
      </div>
      {showMap && (
        <div className="border-secondary relative mt-2 h-96 w-full overflow-hidden rounded-lg border-2">
          <button
            type="button"
            className="border-secondary absolute top-1 right-1 z-[1] cursor-pointer rounded-full border-2 bg-white p-2"
            onClick={handleClickCloseMap}
          >
            <CloseIcon className="fill-secondary h-3 w-3" />
          </button>
          <Map
            defaultCenter={position}
            defaultZoom={13}
            onClick={handleClickOnMap}
            attribution={false}
          >
            <Marker width={50} anchor={position} />
          </Map>
        </div>
      )}
    </div>
  );
}
