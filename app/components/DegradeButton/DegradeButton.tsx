import "./DegradeButton.css";

interface DegradeButtonProps {
  children: string;
  size?: "small" | "large";
  onclick: React.MouseEventHandler<HTMLButtonElement>;
}

const DegradeButton = ({ children, size = "small",onclick }: DegradeButtonProps) => {
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
