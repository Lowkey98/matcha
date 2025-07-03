import { Helmet } from 'react-helmet';
import UploadImage from '../components/UploadImage';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import { ToastError } from '../components/ToastError';
import { useState } from 'react';
import { isValidAddedProfilePicture } from '../../../shared/Helpers';
import { useLocation } from 'react-router-dom';

export default function AddPictures() {
  const [errorAddPictures, setErrorAddPictures] = useState<string | null>(null);
  const [animationTimeout, setAnimationTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const uploadedBuffersPictures: (string | undefined)[] =
    Array(5).fill(undefined);
  // get data from navigate state
  const location = useLocation();
  console.log('location state:', location.state);

  async function handleClickDone() {
    // const uploadedBuffersPictures = location.state?.uploadedBuffersPictures || [];
    const errorCheckUploadedPictures = isValidAddedProfilePicture(
      uploadedBuffersPictures,
    );
    console.log('errorCheckUploadedPictures', errorCheckUploadedPictures);
    if (errorCheckUploadedPictures) {
      if (animationTimeout) clearTimeout(animationTimeout);
      setErrorAddPictures(errorCheckUploadedPictures);
      setAnimationTimeout(
        setTimeout(() => {
          setErrorAddPictures(null);
        }, 4000),
      );
      return;
    }
    console.log('uploadedBuffersPictures:', uploadedBuffersPictures);
    const { age, gender, sexualPreference, interests, biography } =
      location.state || {};
    const response = await fetch('http://localhost:3000/api/create-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        age,
        gender,
        sexualPreference,
        interests,
        biography,
        uploadedBuffersPictures,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Profile created successfully:', data);
    } else {
      const errorData = await response.json();
      console.error('Error creating profile:', errorData);
    }
  }
  return (
    <>
      <Helmet>
        <title>Matcha - Add pictures</title>
      </Helmet>
      <main className="flex flex-col py-16 lg:pb-0 xl:items-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-secondary text-2xl font-bold">
            Add your pictures
          </h1>
          <span className="lg:text-md text-center text-sm font-light text-gray-300">
            Upload images to showcase your style and personality
          </span>
        </div>
        <div className="flex flex-col">
          <div className="mt-12 flex flex-wrap items-center gap-[5%] gap-y-6 lg:gap-y-12 xl:gap-6">
            {uploadedBuffersPictures.map((__, index) => (
              <UploadImage
                key={index}
                uploadedBuffersPictures={uploadedBuffersPictures}
                indexImage={index}
                className="lg:w-[21.2%] xl:w-48"
              />
            ))}
          </div>
          <div className="mt-12 lg:flex lg:justify-end">
            <ButtonPrimary
              type="button"
              value="Done"
              onClick={handleClickDone}
              className="w-full lg:w-32"
            />
          </div>
        </div>
        {errorAddPictures && (
          <ToastError
            message={errorAddPictures}
            setErrorShowToast={setErrorAddPictures}
            animationTimeout={animationTimeout}
            setAnimationTimeout={setAnimationTimeout}
          />
        )}
      </main>
    </>
  );
}
