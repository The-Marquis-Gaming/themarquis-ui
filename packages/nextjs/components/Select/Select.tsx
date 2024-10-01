import React, { useState, useEffect } from "react";
import "./select.css";
import Image from "next/image";
import { Address } from "@starknet-react/chains";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";

const initialOptions = [
  {
    value: "strk",
    label: "STRK",
    icon: "/logo-starknet.svg",
    amount: "",
  },
  { value: "usdc", label: "USDC", icon: "/usdc.svg", isDisabled: true },
];

type BalanceProps = {
  address?: Address;
};

const CustomSelect = ({ address }: BalanceProps) => {
  const [options, setOptions] = useState(initialOptions);
  const [selectedOption, setSelectedOption] = useState(initialOptions[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const { formatted, isLoading, isError } = useScaffoldStrkBalance({
    address,
  });

  useEffect(() => {
    if (formatted) {
      setOptions((prevOptions: any) =>
        prevOptions.map((option: any) =>
          option.value === "strk" ? { ...option, amount: formatted } : option,
        ),
      );
    }
  }, [formatted]);

  const handleOptionClick = (option: (typeof initialOptions)[0]) => {
    if (!option.isDisabled) {
      setSelectedOption(option);
      setIsOpen(false);
    }
  };

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`select-container ${isOpen ? "active" : ""}`}>
      <div className="select-button font-monserrat" onClick={toggleOptions}>
        <div className="flex items-center gap-2">
          <Image
            src={selectedOption.icon}
            alt={selectedOption.label}
            className="icon"
            width={20}
            height={20}
          />
          <span>{selectedOption.label}</span>
        </div>
        <span className="arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
          >
            <path
              d="M12.9182 0H6.68848H1.07872C0.118766 0 -0.361211 1.36604 0.318756 2.16684L5.49853 8.26693C6.32849 9.24436 7.67843 9.24436 8.50839 8.26693L10.4783 5.94701L13.6881 2.16684C14.3581 1.36604 13.8781 0 12.9182 0Z"
              fill="#00ECFF"
            />
          </svg>
        </span>
      </div>
      {isOpen && (
        <div className="select-options font-monserrat">
          {options.map((option) => (
            <div
              key={option.value}
              className={`select-option ${option.isDisabled ? "disabled" : ""}`}
              onMouseEnter={() => setHoveredOption(option.value)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => handleOptionClick(option)}
            >
              <Image
                src={option.icon}
                alt={option.label}
                className="icon"
                width={20}
                height={20}
              />
              <span>{option.label}</span>
              {option.isDisabled ? (
                <span className="lock-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2C9.243 2 7 4.243 7 7V10H6C4.346 10 3 11.346 3 13V19C3 20.654 4.346 22 6 22H18C19.654 22 21 20.654 21 19V13C21 11.346 19.654 10 18 10H17V7C17 4.243 14.757 2 12 2ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V10H9V7ZM19 19C19 19.552 18.552 20 18 20H6C5.448 20 5 19.552 5 19V13C5 12.448 5.448 12 6 12H18C18.552 12 19 12.448 19 13V19Z"
                      fill="#B0BEC5"
                    />
                  </svg>
                </span>
              ) : (
                <span className="amount">{option.amount}</span>
              )}
              {option.isDisabled && hoveredOption === option.value && (
                <div className="coming-soon">Coming Soon</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
