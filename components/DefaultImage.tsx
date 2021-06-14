import Image from "next/image";

interface Props{
  width: number,
  height: number,
  className?: string 
}


const DefaultImage:React.FC<Props> = ({height, width, className = ""}) => {
  return (
    <Image src={"/default_profile_pic.png"} width={width} height={height} className={className} />
  ) 
}

export default DefaultImage;