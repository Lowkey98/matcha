import { Helmet } from 'react-helmet';
import InputFormField from '../components/FormFields/InputFormField';
import { useContext, useEffect, useState } from 'react';
import {
  isValidAge,
  isValidBiography,
  isValidGender,
  isValidInterests,
  isValidSexualPreference,
} from '../../../shared/Helpers';
import DropdownFormField from '../components/FormFields/DropdownFormField';
import { genders, interestsItems, sexualPreferences } from './CreateProfile';
import MultiSelect from '../components/FormFields/MultiSelect';
import TextAreaFormField from '../components/FormFields/TextAreaFormField';
import LocationFormField from '../components/FormFields/LocationFormField';
import UploadImage from '../components/UploadImage';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import ButtonSecondary from '../components/Buttons/ButtonSecondary';
import { UserContext } from '../context/UserContext';
import { UserLocation } from '../../../shared/types';

export default function Settings() {
  const { user } = useContext(UserContext);
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [sexualPreference, setSexualPreference] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [biography, setBiography] = useState<string>('');
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loaderLocation, setLoaderLocation] = useState<boolean>(false);
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const errorAge = isValidAge(Number(age));
  const errorGender = isValidGender(gender);
  const errorSexualPreference = isValidSexualPreference(sexualPreference);
  const errorInterests = isValidInterests(interests);
  const errorBiography = isValidBiography(biography);
  const uploadedBuffersPictures: (string | undefined)[] =
    Array(5).fill(undefined);
  useEffect(() => {
    if (user) {
      if (user.location) setLocation(user.location);
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Matcha - Edit profile</title>
      </Helmet>
      <main className="mt-12 mb-22 lg:mb-5 lg:ml-57">
        <div>
          <h1 className="text-secondary text-2xl font-bold">Edit profile</h1>
          <span className="lg:text-md text-sm font-light text-gray-300">
            Update your personal details and interests
          </span>
        </div>
        <form className="mt-12">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-8 xl:justify-between 2xl:gap-12">
            <div className="lg:w-1/2 xl:flex-2">
              <div className="flex flex-col gap-8 xl:flex-row xl:flex-wrap xl:justify-between xl:gap-0 xl:gap-y-12">
                <InputFormField
                  type="number"
                  label="Age"
                  placeholder="Enter your age"
                  setInputValue={setAge}
                  errorInput={errorAge}
                  formTrail={formTrail}
                  className="xl:w-[48%]"
                  required
                />
                <DropdownFormField
                  label="Gender"
                  placeholder="Select your gender"
                  formTrail={formTrail}
                  dropdownValue={gender}
                  setDropdownValue={setGender}
                  errorDropdown={errorGender}
                  items={genders}
                  className="xl:w-[48%]"
                  required
                />
                <div className="xl:flex xl:w-[48%] xl:items-center">
                  <DropdownFormField
                    label="Sexual preference"
                    placeholder="Select your sexual preference"
                    formTrail={formTrail}
                    dropdownValue={sexualPreference}
                    setDropdownValue={setSexualPreference}
                    errorDropdown={errorSexualPreference}
                    items={sexualPreferences}
                    className="w-full"
                    required
                  />
                </div>
                <TextAreaFormField
                  label="Biography"
                  placeholder="Write a brief description about yourself"
                  setTextAreaValue={setBiography}
                  errorTextArea={errorBiography}
                  formTrail={formTrail}
                  className="xl:w-[48%]"
                  required
                />
                <MultiSelect
                  items={interestsItems}
                  selectedItems={interests}
                  errorMultiSelect={errorInterests}
                  formTrail={formTrail}
                  setSelectedItems={setInterests}
                  className="xl:w-[48%]"
                  required
                />
                {location ? (
                  <LocationFormField
                    className="xl:w-[48%]"
                    location={location}
                    setLocation={setLocation}
                    loaderLocation={loaderLocation}
                    setLoaderLocation={setLoaderLocation}
                  />
                ) : null}
              </div>
            </div>
            <div className="border-grayDark-100 border-t lg:border-t-0 lg:border-r"></div>
            <div className="lg:flex-1">
              <div className="flex flex-wrap gap-[5%] gap-y-6">
                {[...uploadedBuffersPictures].map((__, index) => (
                  <UploadImage
                    key={index}
                    uploadedBuffersPictures={uploadedBuffersPictures}
                    indexImage={index}
                    className="lg:w-[47.5%]"
                  />
                ))}
                <UploadImage
                  uploadedBuffersPictures={uploadedBuffersPictures}
                  indexImage={uploadedBuffersPictures.length}
                  className="lg:w-[47.5%]"
                />
              </div>
            </div>
          </div>
          <div className="mt-20 flex flex-col gap-5 lg:mt-15 lg:flex-row-reverse lg:gap-3">
            <ButtonPrimary
              type="submit"
              value="Save"
              className="w-full lg:w-38"
            />
            <ButtonSecondary
              type="button"
              value="Cancel"
              className="w-full lg:w-38"
            />
          </div>
        </form>
      </main>
    </>
  );
}
