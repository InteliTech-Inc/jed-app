import Image from "next/image";
import LogoImage from "../../public/logo_dark.png";

export function Logo() {
  return (
    <div className="">
      <Image src={LogoImage} alt="logo" width={100} height={100} />
    </div>
  );
}
