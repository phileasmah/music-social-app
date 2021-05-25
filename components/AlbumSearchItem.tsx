import Image from "next/image";
import { AlbumItem } from "../types/SearchType";

interface Props {
  item: AlbumItem;
}

const AlbumSearchItem: React.FC<Props> = ({ item }) => {
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

export default AlbumSearchItem;
