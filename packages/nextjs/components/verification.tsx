"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

const OTPInput: React.FC<{ onOtpComplete: (otp: string) => void }> = ({
  onOtpComplete,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newOtp = [...otp];
    newOtp[index] = event.target.value;
    setOtp(newOtp);

    if (event.target.value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 3) {
      const otpCode = newOtp.join("");
      onOtpComplete(otpCode);
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-6 w-full max-w-md">
        <h2 className="text-xl mb-4 font-screen">Verification Code</h2>
        <div className="flex gap-2">
          {otp.map((value, index) => (
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
              className={`w-12 h-12 text-center border-2 rounded-md text-xl ${
                value ? "border-[#00ECFF]" : "border-gray-300"
              } focus:outline-none focus:border-[#00ECFF]`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OTPInput;
