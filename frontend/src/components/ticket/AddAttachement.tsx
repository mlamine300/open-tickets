/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import React, { useRef, useState } from "react";
import { LuTrash, LuUpload } from "react-icons/lu";

const AddAttachement = ({
  image,
  label,
  setImage,
  className,
  labelClassName,
  imageClassName
}: {
  image: any;
  setImage: any;
  label:string;
  className?:string;
  labelClassName?:string;
  imageClassName?:string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string|null>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) {
      return;
    }

    const file = files[0] ?? null;
    if (file) {
     // console.log(file);
      setImage(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };
  const onChooseFile = () => {
    if (inputRef.current) inputRef.current.click();
  };
  return (
    <div className={className}>
        <label className={labelClassName} htmlFor={`add-attachement${label}`}>
            {label}
        </label>
      <input
        
        id={`add-attachement${label}`}
        ref={inputRef}
        onChange={handleImageChange}
        type="file"
        accept="image/*"
        className="hidden"
      />
      {!image ? (
        <div className={cn(imageClassName," bg-gray-hot w-full min-h-10 h-fit flex items-center justify-center relative")}>
          <Paperclip className="w-10 h-10 text-cold" />
          <button className="" type="button" onClick={onChooseFile}>
            <LuUpload className="absolute -right-2 -bottom-1 w-8 h-8 bg-cold rounded-full p-1 text-text-accent cursor-pointer" />
          </button>
        </div>
      ) : (
        <div className={cn(imageClassName,"bg-gray-hot w-full max-h-36   flex items-center justify-center relative")}>
          <img
            src={previewUrl || ""}
            alt="user photo"
            className="w-full max-h-36 object-scale-down"
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

export default AddAttachement;