import { useState, type ChangeEventHandler } from "react";
import { FaEye } from "react-icons/fa6";
import { FaEyeLowVision } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
type inputProps = {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  type: string;
  placeHolder: string;
  key: string;
  error?: string;
  parentClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
};
const Input = ({
  label,
  value,
  onChange,
  type,
  placeHolder,
  key,
  error,
  parentClassName,
  labelClassName,
  containerClassName,
  inputClassName,
  disabled = false,
}: inputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div className={twMerge("flex flex-col gap-4", parentClassName)}>
      <label className={labelClassName} htmlFor={key}>
        {label}{" "}
      </label>

      <div
        className={twMerge(
          "flex flex-row justify-between items-center rounded  bg-gray-hot/50 p-2 px-4 border border-gray-hot  has-focus:outline outline-primary peer",
          containerClassName
        )}
      >
        {type === "area" ? (
          <textarea
            disabled={disabled}
            id={key}
            value={value}
            onChange={onChange}
            placeholder={placeHolder}
            className={twMerge(
              "w-full bg-transparent outline-none border-none ",
              inputClassName
            )}
          />
        ) : (
          <>
            <input
              disabled={disabled}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              value={value}
              onChange={onChange}
              placeholder={placeHolder}
              id={key}
              className={twMerge(
                "w-full h-full focus:border-none focus:outline-none group",
                inputClassName
              )}
            />
            {type === "password" &&
              (showPassword ? (
                <FaEyeLowVision
                  className="text-gray-cold cursor-pointer"
                  onClick={() => {
                    setShowPassword(false);
                  }}
                />
              ) : (
                <FaEye
                  className="text-primary cursor-pointer"
                  onClick={() => {
                    setShowPassword(true);
                  }}
                />
              ))}
          </>
        )}
      </div>
      {error && <p className="text-red-600 text-sm ">{error}</p>}
    </div>
  );
};

export default Input;
