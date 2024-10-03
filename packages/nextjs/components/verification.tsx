"use client";

import {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

const OTPInput: React.FC<{
  onOtpComplete: (otp: string) => Promise<void>;
  otp: any;
  setOtp: any;
}> = ({ onOtpComplete, otp, setOtp }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (isSubmitting) return;
    const newValue = event.target.value;

    if (!/^\d*$/.test(newValue)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    if (newValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit)) {
      const otpCode = newOtp.join("");
      setIsSubmitting(true);
      onOtpComplete(otpCode).finally(() => {
        setIsSubmitting(false);
      });
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (isSubmitting) return;

    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasteData = event.clipboardData.getData("text");
    if (!/^\d{4}$/.test(pasteData)) return;

    const newOtp = pasteData.split("").slice(0, 4);
    setOtp(newOtp);

    newOtp.forEach((digit, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = digit;
      }
    });

    if (newOtp.every((digit) => digit)) {
      const otpCode = newOtp.join("");
      setIsSubmitting(true);
      onOtpComplete(otpCode).finally(() => {
        setIsSubmitting(false);
      });
    }
  };

  return (
    <div>
      <div className="w-full max-w-md">
        <h2 className="text-xl mb-4">Verification Code</h2>
        <div className="flex gap-2">
          {otp.map((value: any, index: number) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`bg-[#21252B] box-verifi text-center border-2 rounded-md text-xl ${
                value ? "border-[#00ECFF]" : "border-none"
              } focus:outline-none focus:border-[#00ECFF]`}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OTPInput;
