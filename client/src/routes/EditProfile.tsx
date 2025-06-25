import { Helmet } from 'react-helmet';
import InputFormField from '../components/FormFields/InputFormField';
import { useState } from 'react';
import {
  isValidAge,
  isValidBiography,
  isValidGender,
  isValidInterests,
  isValidSexualPreference,
} from '../../Helpers';
import DropdownFormField from '../components/FormFields/DropdownFormField';
import { genders, interestsItems, sexualPreferences } from './CreateProfile';
import MultiSelect from '../components/FormFields/MultiSelect';
import TextAreaFormField from '../components/FormFields/TextAreaFormField';
import LocationFormField from '../components/FormFields/LocationFormField';
import UploadImage from '../components/UploadImage';

export default function Settings() {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [sexualPreference, setSexualPreference] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [biography, setBiography] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const errorAge = isValidAge(age);
  const errorGender = isValidGender(gender);
  const errorSexualPreference = isValidSexualPreference(sexualPreference);
  const errorInterests = isValidInterests(interests);
  const errorBiography = isValidBiography(biography);
  const uploadedBuffersPictures: (string | undefined)[] =
    Array(5).fill(undefined);
  function handleClickNextCreateProfile() {
    let errorForm: boolean = false;
    if (
      errorAge ||
      errorGender ||
      errorSexualPreference ||
      errorInterests ||
      errorBiography
    ) {
      setFormTrial(true);
      errorForm = true;
    }

    if (!errorForm) {
      console.log(age, gender, sexualPreference, interests, biography);
    }
  }
  return (
    <>
      <Helmet>
        <title>Matcha - Edit profile</title>
      </Helmet>
      <main className="mt-12 mb-22 flex flex-col justify-between gap-12 lg:mb-0 lg:ml-57 lg:flex-row lg:gap-8">
        <div className="lg:flex-1">
          <div>
            <h1 className="text-secondary text-2xl font-bold">Edit profile</h1>
            <span className="lg:text-md text-sm font-light text-gray-300">
              Update your personal details and interests
            </span>
          </div>
          <form className="mt-12 flex flex-col">
            <div className="flex flex-col gap-8 lg:justify-between lg:gap-0 lg:gap-y-10">
              <InputFormField
                type="number"
                label="Age"
                placeholder="Enter your age"
                setInputValue={setAge}
                errorInput={errorAge}
                formTrail={formTrail}
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
                required
              />
              <div className="">
                <DropdownFormField
                  label="Sexual preference"
                  placeholder="Select your sexual preference"
                  formTrail={formTrail}
                  dropdownValue={sexualPreference}
                  setDropdownValue={setSexualPreference}
                  errorDropdown={errorSexualPreference}
                  items={sexualPreferences}
                  required
                />
              </div>
              <TextAreaFormField
                label="Biography"
                placeholder="Write a brief description about yourself"
                setTextAreaValue={setBiography}
                errorTextArea={errorBiography}
                formTrail={formTrail}
                required
              />
              <MultiSelect
                items={interestsItems}
                selectedItems={interests}
                errorMultiSelect={errorInterests}
                formTrail={formTrail}
                setSelectedItems={setInterests}
                className=""
                required
              />
              <LocationFormField className="" setLocationValue={setLocation} />
            </div>
          </form>
        </div>
        <div className="border-grayDark-100 border-t lg:border-t-0 lg:border-r"></div>
        <div className="lg:flex-1">
          <div className="flex flex-wrap gap-[5%] gap-y-6">
            {uploadedBuffersPictures.map((__, index) => (
              <UploadImage
                key={index}
                uploadedBuffersPictures={uploadedBuffersPictures}
                indexImage={index}
              />
            ))}
            <UploadImage
              uploadedBuffersPictures={uploadedBuffersPictures}
              indexImage={uploadedBuffersPictures.length - 1}
            />
          </div>
        </div>
      </main>
    </>
  );
}
