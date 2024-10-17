import "./loadingTextButton.css";

const LoadingTextButton = ({ color }: { color: string }) => {
  return (
    <div className="loader flex items-center gap-2 justify-center mb-1">
      <div
        style={{
          backgroundColor: `#${color}`,
        }}
      ></div>
      <div
        style={{
          backgroundColor: `#${color}`,
        }}
      ></div>
      <div
        style={{
          backgroundColor: `#${color}`,
        }}
      ></div>
    </div>
  );
};

export default LoadingTextButton;
