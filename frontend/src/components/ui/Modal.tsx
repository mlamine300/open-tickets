/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type ReactElement } from "react";

import { HiOutlineXMark } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

const Modal = ({
  children,
  close,
  showModal,
  title,
  className,
}: {
  children: ReactElement | ReactElement[];
  close: any;
  showModal: boolean;
  title: string;
  className?: string;
}) => {
  if (!showModal) return null;

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };
  return (
    <div
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 "
    >
      <div
        className={twMerge(
          "bg-white rounded-lg p-6 w-full m-8 md:max-w-[600px] relative h-96 max-w-[90%]",
          className
        )}
      >
        <HiOutlineXMark
          onClick={close}
          className="absolute top-6 text-gray-cold  right-4 text-2xl font-normal cursor-pointer hover:text-red-600"
        />
        {title && (
          <div className="mb-4 border-b pb-2 border-gray-cold/50">
            <h3 className="text-lg font-semibold ">{title}</h3>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
