import { useRef, useState } from 'react';
import { EditIcon, PlusIcon } from './Icons';
import { useToast } from '../hooks/useToast';

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
