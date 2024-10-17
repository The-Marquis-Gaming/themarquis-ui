import "./loadingTextButton.css";

const LoadingTextButton = () => {
  return (
    <div className="loader flex items-center gap-2 justify-center">
      <p className="text-[24px] font-arcade">Loading</p>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingTextButton;
