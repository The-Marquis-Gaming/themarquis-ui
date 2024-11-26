import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Image src={"/loadingpage.gif"} alt="giffile" width={950} height={260} />
    </div>
  );
}
