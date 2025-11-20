/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { LuTrash, LuUpload, LuUser } from "react-icons/lu";

const ProfilePhotoSelector = ({
  image,
  setImage,
}: {
  image: any;
  setImage: any;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) {
      return;
    }

    const file = files[0] ?? null;
    if (file) {
      console.log(file);
      setImage(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
  };
  const onChooseFile = () => {
    if (inputRef.current) inputRef.current.click();
  };
  return (
    <div>
      <input
        ref={inputRef}
        onChange={handleImageChange}
        type="file"
        accept="image/*"
        className="hidden"
      />
      {!image ? (
        <div className="rounded-full bg-hot w-20 h-20 flex items-center justify-center relative">
          <LuUser className="w-10 h-10 text-cold" />
          <button className="" type="button" onClick={onChooseFile}>
            <LuUpload className="absolute -right-2 -bottom-1 w-8 h-8 bg-cold rounded-full p-1 text-text-accent cursor-pointer" />
          </button>
        </div>
      ) : (
        <div className="rounded-full bg-hot w-20 h-20 flex items-center justify-center relative">
          <img
            src={previewUrl || ""}
            alt="user photo"
            className="rounded-full"
          />
          <button
            type="button"
            className="w-8 h-8 bg-red-600 rounded-full absolute -right-2 -bottom-1 flex items-center justify-center "
            onClick={handleRemoveImage}
          >
            <LuTrash className="w-6 h-6  rounded-full p-1  text-text-accent cursor-pointer" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
