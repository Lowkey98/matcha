import { Helmet } from 'react-helmet';
import UploadImage from '../components/UploadImage';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import { ToastError } from '../components/ToastError';
import { useState } from 'react';
import { isValidAddedProfilePicture } from '../../../shared/Helpers';

export default function AddPictures() {
  const [errorAddPictures, setErrorAddPictures] = useState<string | null>(null);
  const [animationTimeout, setAnimationTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const uploadedBuffersPictures: (string | undefined)[] =
    Array(5).fill(undefined);
  function handleClickDone() {
    const errorCheckUploadedPictures = isValidAddedProfilePicture(
      uploadedBuffersPictures,
    );
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
