import { useRef, useState } from 'react';
import { EditIcon, PlusIcon } from './Icons';

export default function UploadImage({
  uploadedBuffersPictures,
  indexImage,
  className,
}: {
  uploadedBuffersPictures: (string | undefined)[];
  indexImage: number;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  function handleClickUploadImage() {
    fileInputRef?.current?.click();
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    // jpeg, png, webp
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        console.error(
          `file size ${(file.size / 1024 / 1024).toFixed(2)} MB exceeds the sime limit [${maxSize / 1024 / 1024} MB]`,
        );
        return;
      }
      const extension = file.name.split('.').pop();
      if (extension !== 'jpeg' && extension !== 'png' && extension !== 'webp') {
        console.error(`.${extension} not allowed`)
        return
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
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
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
