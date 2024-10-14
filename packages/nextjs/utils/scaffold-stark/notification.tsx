import React from "react";
import { ToastPosition, toast } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

type NotificationProps = {
  content: React.ReactNode;
  status: "success" | "info" | "loading" | "error" | "warning" | "wrongNetwork";
  duration?: number;
  icon?: string;
  position?: ToastPosition;
};

type NotificationOptions = {
  duration?: number;
  icon?: string;
  position?: ToastPosition;
};

const ENUM_STATUSES = {
  success: <CheckCircleIcon className="w-7 text-success" />,
  loading: <span className="w-6 loading loading-spinner"></span>,
  error: <Image src="/error-noti.svg" width={20} height={20} alt="icon" />,
  info: <InformationCircleIcon className="w-7 text-info" />,
  warning: <Image src="/warning-noti.svg" width={20} height={20} alt="icon" />,
  wrongNetwork: (
    <Image src="/error-noti.svg" width={20} height={20} alt="icon" />
  ),
};
const DEFAULT_DURATION = 3000;
const DEFAULT_POSITION: ToastPosition = "top-center";

const Notification = ({
  content,
  status,
  duration = DEFAULT_DURATION,
  icon,
  position = DEFAULT_POSITION,
}: NotificationProps) => {
  let statusClass = "";
  let extraContent = null;

  switch (status) {
    case "success":
      statusClass = "noti-success";
      // extraContent = <p className="font-bold text-green-500 m-0">Great Job!</p>;
      break;
    case "error":
      statusClass = "noti-error";
      extraContent = <p className="font-bold text-red-500 m-0">Oh no!</p>;
      break;
    case "warning":
      statusClass = "noti-warning";
      extraContent = <p className="font-bold text-yellow-500 m-0">Oops!</p>;
      break;
    case "wrongNetwork":
      statusClass = "noti-error";
      extraContent = (
        <p className="font-bold text-red-500 text-[14px] m-0">
          You are in wrong network
        </p>
      );
      break;

    default:
      statusClass = "";
      break;
  }

  return toast.custom(
    (t) => (
      <div
        className={`flex flex-row items-center justify-between max-w-sm rounded-xl shadow-center shadow-accent bg-base-200 p-4 transform-gpu relative transition-all duration-500 ease-in-out space-x-2
        ${statusClass} ${
          position.substring(0, 3) === "top"
            ? `hover:translate-y-1 ${t.visible ? "top-0" : "-top-96"}`
            : `hover:-translate-y-1 ${t.visible ? "bottom-0" : "-bottom-96"}`
        }`}
      >
        <div className="leading-[0] self-center">
          {icon ? icon : ENUM_STATUSES[status]}
        </div>

        <div
          className={`mx-3 overflow-x-hidden break-words text-[14px] whitespace-pre-line ${icon ? "mt-1" : ""}`}
        >
          {extraContent}
          {content}
        </div>

        <div
          className={`cursor-pointer text-[14px] ${icon ? "mt-1" : ""}`}
          onClick={() => toast.dismiss(t.id)}
        >
          <XMarkIcon
            className="w-6 cursor-pointer"
            onClick={() => toast.remove(t.id)}
          />
        </div>
      </div>
    ),
    {
      duration: status === "loading" ? Infinity : duration,
      position,
    },
  );
};

export const notification = {
  success: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "success", ...options });
  },
  info: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "info", ...options });
  },
  warning: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "warning", ...options });
  },
  error: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "error", ...options });
  },
  wrongNetwork: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "wrongNetwork", ...options });
  },
  loading: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "loading", ...options });
  },

  remove: (toastId: string) => {
    toast.remove(toastId);
  },
};
