/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { HiOutlineXMark } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

type ModalProps = {
  children?: ReactNode;
  close: () => void;
  showModal: boolean;
  title?: string;
  className?: string;
  ariaLabel?: string;
};

const Modal = ({ children, close, showModal, title, className, ariaLabel }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showModal) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }

      if (e.key === "Tab") {
        // simple focus trap
        const el = modalRef.current;
        if (!el) return;
        const focusable = el.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // focus first focusable element or the modal container
    const timer = setTimeout(() => {
      const el = modalRef.current;
      if (!el) return;
      const firstFocusable = el.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      (firstFocusable ?? el).focus();
    }, 0);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showModal, close]);

  if (!showModal) return null;

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title ?? "modal"}
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={twMerge("bg-white rounded-lg p-6 w-full m-8 md:max-w-[600px] relative max-w-[90%]", className)}
      >
        <button
          onClick={close}
          aria-label="Close modal"
          className="absolute top-6 right-4 text-2xl text-gray-cold cursor-pointer hover:text-red-600"
        >
          <HiOutlineXMark />
        </button>

        {title && (
          <div className="mb-4 border-b pb-2 border-gray-cold/50">
            <h3 className="text-lg font-semibold ">{title}</h3>
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
