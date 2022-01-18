import Image from "next/image";
import loadingSpinner from "../public/svg/Spinner-1s-200px.svg";
export default function LoadingSpinner() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Image src={loadingSpinner} width={100} height={100} alt="loading " />
    </div>
  );
}
