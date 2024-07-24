import "./DegradeButton.css";

interface DegradeButtonProps {
  children: string;
  size?: "small" | "large";
  onClick?: () => void;
}

const DegradeButton = ({
  children,
  size = "small",
  onClick,
}: DegradeButtonProps) => {
  const isSmall = size === "small";
  return (
    <button
      onClick={onClick}
      className={`text-white text-xs hover:text-gray-200 btn-conect-wallet degrade_button__${
        isSmall ? "small" : "large"
      }`}
    >
      {children}
    </button>
  );
};

export default DegradeButton;
