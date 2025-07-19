import { useEffect, useState } from 'react';
import { UserLocation } from '../../../../shared/types';
import ButtonPrimary from '../Buttons/ButtonPrimary';
import { CloseIcon, LocationIcon, LocationNotExistsIcon } from '../Icons';
import { Map, Marker } from 'pigeon-maps';
import { getAddress } from '../../../Api';
import { useToast } from '../../hooks/useToast';
import ButtonPrimaryWithIcon from '../Buttons/ButtonPrimaryWithIcon';
import LoaderDots from '../Loaders';
export default function FormInputField({
  location,
  setLocation,
  loaderLocation,
  setLoaderLocation,
  className,
}: {
  location: UserLocation | null;
  setLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
  loaderLocation: boolean;
  setLoaderLocation: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  const defaultLocation: [number, number] = location
    ? [location.latitude, location.longitude]
    : [0, 0];
  const [position, setPosition] = useState<[number, number]>(defaultLocation);
  const [showMap, setShowMap] = useState<boolean>(false);
  const { addToast } = useToast();
  function handleClickEditLocation() {
    setShowMap(true);
  }
  function handleClickOnMap({ latLng }: { latLng: [number, number] }) {
    setLoaderLocation(true);
    getAddress({ latitude: latLng[0], longitude: latLng[1] })
      .then((address: string) => {
        setLoaderLocation(false);
        const userLocation: UserLocation = {
          address,
          latitude: latLng[0],
          longitude: latLng[1],
        };
        setLocation(userLocation);
        setPosition(latLng);
      })
      .catch((error) => {
        setLoaderLocation(false);
        addToast({
          status: 'error',
          message: error,
        });
      });
  }
  function handleClickCloseMap() {
    setShowMap(false);
  }
  useEffect(() => {
    if (location) setPosition([location.latitude, location.longitude]);
  }, [location]);
  return (
    <div className={className}>
      <label className="text-secondary font-medium">GPS position</label>
      {loaderLocation ? (
        <div className="border-grayDark-100 mt-2 flex h-13 items-center gap-1 rounded-lg border-2 px-3">
          <LocationIcon className="fill-primary h-5 w-5" />
          <LoaderDots dotsClass="bg-primary/50 w-1 h-1" />
        </div>
      ) : location ? (
        <div className="border-grayDark-100 mt-2 flex h-13 items-center justify-between rounded-lg border-2 px-3">
          <div className="flex items-center gap-1">
            <LocationIcon className="fill-primary h-5 w-5" />
            <span className="text-secondary">{location.address}</span>
          </div>
          <ButtonPrimary
            type="button"
            value="Edit"
            className="h-auto w-20 py-1 text-sm"
            onClick={handleClickEditLocation}
          />
        </div>
      ) : (
        <div className="border-secondary mt-2 flex h-13 items-center justify-center gap-1 rounded-lg border-2 bg-gray-100 px-3 text-sm text-gray-400">
          <LocationNotExistsIcon className="h-5 w-5 fill-gray-400" />
          <span>Enable location permissions.</span>
        </div>
      )}
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
