import Image from "next/image";
import { ArtistItem } from "../types/SearchType";

interface Props {
  item: ArtistItem,
}

const ArtistSearchItem: React.FC<Props> = ({ item }) => {
  return (
    <div className="text-option">
      {item.name}
      {item.images.length != 0 ? (
        <Image src={item.images[0].url} alt={item.name + "photo"} width={63} height={63} />
      ) : (
        <div>No image</div>
      )}
    </div>
  );
};

export default ArtistSearchItem;
