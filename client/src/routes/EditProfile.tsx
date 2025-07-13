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
import CreateProfile, {
  genders,
  interestsItems,
  sexualPreferences,
} from './CreateProfile';
import MultiSelect from '../components/FormFields/MultiSelect';
import TextAreaFormField from '../components/FormFields/TextAreaFormField';
import LocationFormField from '../components/FormFields/LocationFormField';
import UploadImage from '../components/UploadImage';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import ButtonSecondary from '../components/Buttons/ButtonSecondary';
import { UserContext } from '../context/UserContext';
import {
  CreateProfileBase,
  CreateProfileResponse,
  UpdatedUserProfileInfos,
  UserInfo,
} from '../../../shared/types';
import { useToast } from '../hooks/useToast';
import { updateUserProfileInfos } from '../../Api';
import { BACKEND_STATIC_FOLDER } from '../components/ImagesCarousel';

export default function Settings() {
  const { user, setUser } = useContext(UserContext);
  console.log('user:', user);

  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [sexualPreference, setSexualPreference] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [biography, setBiography] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [imagesUrls, setImagesUrls] = useState<(string | undefined)[]>([]);
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const { addToast } = useToast();
  const errorAge = isValidAge(Number(age));
  const errorGender = isValidGender(gender);
  const errorSexualPreference = isValidSexualPreference(sexualPreference);
  const errorInterests = isValidInterests(interests);
  const errorBiography = isValidBiography(biography);

  function handleClickSaveUserProfileInfos() {
    if (user) {
      setFormTrial(true);
      if (
        errorAge ||
        errorGender ||
        errorSexualPreference ||
        errorInterests ||
        errorBiography
      )
        return;
      const defaultValues: UpdatedUserProfileInfos = {
        id: user.id,
        age: Number(user.age),
        gender: user.gender || '',
        sexualPreference: user.sexualPreference || '',
        biography: user.biography || '',
        interests: user.interests || [],
        imagesUrls: user.imagesUrls || [],
      };
      const updatedUserProfileInfos: UpdatedUserProfileInfos = {
        id: user.id,
        age: Number(age),
        gender,
        sexualPreference,
        biography,
        interests,
        imagesUrls: user.imagesUrls || [],
      };
      const userProfileInfosChanged =
        JSON.stringify(defaultValues, Object.keys(defaultValues).sort()) !==
        JSON.stringify(
          updatedUserProfileInfos,
          Object.keys(updatedUserProfileInfos).sort(),
        );
      console.log('updatedUserProfileInfos:', updatedUserProfileInfos);

      if (userProfileInfosChanged) {
        updateUserProfileInfos({ updatedUserProfileInfos })
          .then(() => {
            setUser({
              ...user,
              ...updatedUserProfileInfos,
            });
            addToast({
              status: 'success',
              message: 'Your profile information updated successfully.',
            });
          })
          .catch((error) => {
            const errorMessage = error.error;
            addToast({
              status: 'error',
              message: errorMessage,
            });
          });
      }
    }
  }
  function handleClickCancel() {
    if (user) {
      setAge(String(user.age));
      setGender(user.gender || '');
      setSexualPreference(user.sexualPreference || '');
      setBiography(user.biography || '');
      setInterests(user.interests || []);
    }
  }

  useEffect(() => {
    if (user) {
      setAge(String(user.age));
      setGender(user.gender || '');
      setSexualPreference(user.sexualPreference || '');
      setBiography(user.biography || '');
      setInterests(user.interests || []);
      if (user.imagesUrls) {
        const imageUrlsWithHostName: string[] = user.imagesUrls.map(
          (imageUrl) => `${BACKEND_STATIC_FOLDER}${imageUrl}`,
        );
        setImagesUrls(imageUrlsWithHostName);
      }
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
                  defaultValue={age}
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
                  defaultValue={biography}
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
                <LocationFormField
                  className="xl:w-[48%]"
                  setLocationValue={setLocation}
                />
              </div>
            </div>
            <div className="border-grayDark-100 border-t lg:border-t-0 lg:border-r"></div>
            <div className="lg:flex-1">
              <div className="flex flex-wrap gap-[5%] gap-y-6">
                {imagesUrls.map((imageUrl: string | undefined, index) => {
                  return (
                    <UploadImage
                      key={index}
                      uploadedBuffersPictures={imagesUrls}
                      indexImage={index}
                      defaultValue={imageUrl}
                      className="lg:w-[47.5%]"
                    />
                  );
                })}
                <UploadImage
                  uploadedBuffersPictures={imagesUrls}
                  indexImage={imagesUrls.length}
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
              onClick={handleClickSaveUserProfileInfos}
            />
            <ButtonSecondary
              type="button"
              value="Cancel"
              className="w-full lg:w-38"
              onClick={handleClickCancel}
            />
          </div>
        </form>
      </main>
    </>
  );
}
