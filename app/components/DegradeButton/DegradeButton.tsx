import "./DegradeButton.css";

interface DegradeButtonProps {
  children: string;
  size?: "small" | "large";

}

const DegradeButton = ({ children, size = "small"}: DegradeButtonProps) => {
  const isSmall = size === "small";
  return (
    <button
      className={`text-white text-xs hover:text-gray-200 btn-conect-wallet degrade_button__${
        isSmall ? "small" : "large"
      }`}
    >
      {children}
    </button>
  );
};

export default DegradeButton;
