import Image from "next/image";
import Link from "next/link";
import { AlbumItem, ArtistItem } from "../types/SearchType";

interface Props<T extends "album" | "artist"> {
  search: T,
  item: T extends "album" ? AlbumItem : ArtistItem
}

const SearchItem = <T extends "album" | "artist">({ search, item }: Props<T>) => {
  return (
    <Link href={{ pathname: `${search}/[slug]`, query: { slug: item.id } }}>
      <a className="focus:bg-darkgrey focus:p-3 hover:bg-darkgrey hover:p-3 block text-option my-2 duration-200 rounded-lg">
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
      </a>
    </Link>
  );
};

export default SearchItem;
