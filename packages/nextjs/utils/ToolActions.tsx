import { notification } from "./scaffold-stark";

export const copyToClipboardAction = (text: string) => {
  if (text) {
    navigator.clipboard.writeText(text).then(
      () => {
        notification.success("Coppied successfully");
      },
      (err) => {
        console.error("Failed to copy: ", err);
      },
    );
  }
};
