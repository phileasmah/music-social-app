import Image from "next/image";
import { ArtistItem } from "../types/SearchType";

interface Props {
  item: ArtistItem;
}

const ArtistSearchItem: React.FC<Props> = ({ item }) => {
  return (
    <div className="text-option">
      {item.images.length != 0 ? (
        <Image
          src={item.images[0].url}
          alt={"Picture of " + item.name}
          width={63}
          height={63}
          className="rounded-full"
        />
      ) : (
        <div>No image</div>
      )}
      {item.name}
    </div>
  );
};

export default ArtistSearchItem;
