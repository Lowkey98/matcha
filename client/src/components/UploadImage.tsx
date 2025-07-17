import { useEffect, useRef, useState } from 'react';
import { CloseIcon, EditIcon, PlusIcon, StarBoldIcon } from './Icons';
import { useToast } from '../hooks/useToast';
import { BACKEND_STATIC_FOLDER } from './ImagesCarousel';

export function UploadImage({
  uploadedBuffersPictures,
  indexImage,
  defaultValue,
  className,
}: {
  uploadedBuffersPictures: (string | undefined)[];
  indexImage: number;
  defaultValue?: string;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    defaultValue,
  );
  const { addToast } = useToast();
  function handleClickUploadImage() {
    fileInputRef?.current?.click();
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const KB = 1024;
    const MB = KB * 1024;
    const maxSize = 2 * MB;
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        addToast({
          status: 'error',
          errorCode: 101,
          message: `file size ${(file.size / MB).toFixed(2)} MB exceeds the sime limit [${maxSize / MB} MB]`,
        });
        console.error(
          `file size ${(file.size / MB).toFixed(2)} MB exceeds the sime limit [${maxSize / MB} MB]`,
        );
        return;
      }
      const extension = file.name.split('.').pop();
      if (extension !== 'jpeg' && extension !== 'png' && extension !== 'webp') {
        addToast({
          status: 'error',
          errorCode: 102,
          message: `extension .${extension} not allowed`,
        });
        return;
      }
      // if format isnt jpeg, png, webp

      const reader = new FileReader();

      reader.onloadend = () => {
        const bufferImage = String(reader.result);
        uploadedBuffersPictures[indexImage] = bufferImage;
        setImagePreview(String(bufferImage));
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className={`${className} flex h-64 w-[47.5%] sm:w-[30%]`}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".jpeg,.jpg,.png,.webp"
      />
      <button
        type="button"
        className="relative h-full w-full cursor-pointer rounded-3xl bg-[#F1F1F1]"
        onClick={handleClickUploadImage}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="user picture"
            className="h-full w-full rounded-3xl object-cover"
          />
        ) : null}
        <div className="bg-secondary absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white">
          {imagePreview ? (
            <EditIcon className="h-3 w-3 fill-white" />
          ) : (
            <PlusIcon className="h-3 w-3 fill-white" />
          )}
        </div>
      </button>
    </div>
  );
}

export function EditedUploadImage({
  imagesUrls,
  indexImage,
  setImagesUrls,
  defaultValue,
  className,
}: {
  imagesUrls: string[];
  setImagesUrls: React.Dispatch<React.SetStateAction<string[]>>;
  indexImage: number;
  defaultValue?: string;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    defaultValue,
  );
  useEffect(() => {
    if (defaultValue) setImagePreview(defaultValue);
  }, [defaultValue]);
  const { addToast } = useToast();
  function handleClickUploadImage() {
    fileInputRef?.current?.click();
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const KB = 1024;
    const MB = KB * 1024;
    const maxSize = 2 * MB;
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        addToast({
          status: 'error',
          errorCode: 101,
          message: `file size ${(file.size / MB).toFixed(2)} MB exceeds the sime limit [${maxSize / MB} MB]`,
        });
        console.error(
          `file size ${(file.size / MB).toFixed(2)} MB exceeds the sime limit [${maxSize / MB} MB]`,
        );
        return;
      }
      const extension = file.name.split('.').pop();
      if (extension !== 'jpeg' && extension !== 'png' && extension !== 'webp') {
        addToast({
          status: 'error',
          errorCode: 102,
          message: `extension .${extension} not allowed`,
        });
        return;
      }
      // if format isnt jpeg, png, webp

      const reader = new FileReader();

      reader.onloadend = () => {
        const bufferImage = String(reader.result);
        const uploadedImagesWithUpdatedImage: string[] = imagesUrls.map(
          (imageUrl, index) => {
            if (index === indexImage) return bufferImage;
            return imageUrl;
          },
        );
        setImagesUrls(uploadedImagesWithUpdatedImage);
        setImagePreview(String(bufferImage));
      };
      reader.readAsDataURL(file);
    }
  };

  function handleClickRemoveImage() {
    const uploadedImagesWithoutCurrentImage: string[] = imagesUrls.filter(
      (_, index) => index !== indexImage,
    );
    setImagesUrls(uploadedImagesWithoutCurrentImage);
  }

  return (
    <div className={`${className} relative flex h-64 w-[47.5%] sm:w-[30%]`}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".jpeg,.jpg,.png,.webp"
      />
      <button
        type="button"
        className="relative h-full w-full cursor-pointer rounded-3xl bg-[#F1F1F1]"
        onClick={handleClickUploadImage}
      >
        {imagePreview ? (
          <div className="relative h-full w-full">
            <img
              src={imagePreview}
              alt="user picture"
              className="h-full w-full rounded-3xl object-cover"
            />
            {indexImage === 0 && (
              <div className="bg-primary absolute top-2 left-2 rounded-full p-1.5">
                <StarBoldIcon className="size-3.5 fill-white" />
              </div>
            )}
          </div>
        ) : null}
        <div className="bg-secondary absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white">
          {imagePreview ? (
            <EditIcon className="h-3 w-3 fill-white" />
          ) : (
            <PlusIcon className="h-3 w-3 fill-white" />
          )}
        </div>
      </button>
      {imagesUrls.length > 5 && (
        <button
          className="absolute -top-1 -right-1 cursor-pointer rounded-full bg-red-50 p-2 transition-colors hover:bg-red-100"
          type="button"
          onClick={handleClickRemoveImage}
        >
          <CloseIcon className="h-2.5 w-2.5 fill-red-400" />
        </button>
      )}
    </div>
  );
}

export function ButtonAddImage({
  imagesUrls,
  setImagesUrls,
  className,
}: {
  imagesUrls: string[];
  setImagesUrls: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addToast } = useToast();
  function handleClickUploadImage() {
    fileInputRef?.current?.click();
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const KB = 1024;
    const MB = KB * 1024;
    const maxSize = 2 * MB;
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        addToast({
          status: 'error',
          errorCode: 101,
          message: `file size ${(file.size / MB).toFixed(2)} MB exceeds the sime limit [${maxSize / MB} MB]`,
        });
        console.error(
          `file size ${(file.size / MB).toFixed(2)} MB exceeds the sime limit [${maxSize / MB} MB]`,
        );
        return;
      }
      const extension = file.name.split('.').pop();
      if (extension !== 'jpeg' && extension !== 'png' && extension !== 'webp') {
        addToast({
          status: 'error',
          errorCode: 102,
          message: `extension .${extension} not allowed`,
        });
        return;
      }
      // if format isnt jpeg, png, webp

      const reader = new FileReader();

      reader.onloadend = () => {
        const bufferImage = String(reader.result);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setImagesUrls([...imagesUrls, bufferImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${className} relative flex h-64 w-[47.5%] sm:w-[30%]`}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".jpeg,.jpg,.png,.webp"
      />
      <button
        type="button"
        className="relative h-full w-full cursor-pointer rounded-3xl bg-[#F1F1F1]"
        onClick={handleClickUploadImage}
      >
        <div className="bg-secondary absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white">
          <PlusIcon className="h-3 w-3 fill-white" />
        </div>
      </button>
    </div>
  );
}
