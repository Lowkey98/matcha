import { useState } from "react";
import { BurgerIcon } from "../components/Icons";
import {
  isValidAge,
  isValidGender,
  isValidSexualPreference,
  isValidInterests,
  isValidBiography,
} from "../../Helpers";
import InputFormField from "../components/FormFields/InputFormField";
import DropdownFormField from "../components/FormFields/DropdownFormField";
import MultiSelect from "../components/FormFields/MultiSelect";
import TextAreaFormField from "../components/FormFields/TextAreaFormField";
import ButtonPrimary from "../components/Buttons/ButtonPrimary";

import { Helmet } from "react-helmet";

export default function CreateProfile() {
  const genders: string[] = ["Men", "Women"];
  const sexualPreferences = ["Men", "Women"];
  const interestsItems = [
    "Music",
    "Dancing",
    "Singing",
    "Gaming",
    "Reading",
    "Writing",
    "Movies",
    "Anime",
    "Traveling",
    "Hiking",
    "Fitness",
    "Yoga",
    "Cooking",
    "Baking",
    "Photography",
    "Art",
    "Pets",
    "Tech",
    "Coding",
    "Fashion",
    "Shopping",
    "Volunteering",
  ];
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [sexualPreference, setSexualPreference] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [biography, seBiography] = useState<string>("");
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const errorAge = isValidAge(age);
  const errorGender = isValidGender(gender);
  const errorSexualPreference = isValidSexualPreference(sexualPreference);
  const errorInterests = isValidInterests(interests);
  const errorBiography = isValidBiography(biography);

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
        <title>Matcha - Create profile</title>
      </Helmet>
      <main className="min-w-xs p-5 lg:px-0">
        <div className="flex items-center justify-between">
          <img src="logo.svg" alt="logo" className="w-42" />
          <button
            type="button"
            className="border-grayDark-100 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2.5"
          >
            <BurgerIcon className="fill-secondary h-6 w-6" />
          </button>
        </div>
        <div className="mt-16 flex flex-col items-center justify-center">
          <h1 className="text-secondary text-2xl font-bold">
            Create your profile
          </h1>
          <span className="lg:text-md text-sm font-light text-gray-300">
            Set up your account in just a few steps
          </span>
        </div>
        <form className="mt-12">
          <div className="flex flex-col gap-8">
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

            <MultiSelect
              items={interestsItems}
              selectedItems={interests}
              errorMultiSelect={errorInterests}
              formTrail={formTrail}
              setSelectedItems={setInterests}
              required
            />
            <TextAreaFormField
              label="Biography"
              placeholder="Write a brief description about yourself"
              setTextAreaValue={seBiography}
              errorTextArea={errorBiography}
              formTrail={formTrail}
              required
            />
          </div>
          <ButtonPrimary
            type="submit"
            value="Next"
            className="mt-12 w-full"
            onClick={handleClickNextCreateProfile}
          />
        </form>
      </main>
    </>
  );
}
