import Image from "next/image";
import Link from "next/link";
import { AlbumItem, ArtistItem } from "../types/SearchType";
import DefaultImage from "./DefaultImage";

interface Props<T extends "album" | "artist"> {
  search: T,
  item: T extends "album" ? AlbumItem : ArtistItem
}

const SearchItem = <T extends "album" | "artist">({ search, item }: Props<T>) => {
  return (
    <Link href={`/${search}/${item.id}`} prefetch={false}>
      <a className="block">
        {item.images.length != 0 ? (
          <Image
            src={item.images[0].url}
            alt={"Picture of " + item.name}
            width={63}
            height={63}
            className="rounded-full"
          />
        ) : (
          <DefaultImage />
        )}
        {item.name}
      </a>
    </Link>
  );
};

export default SearchItem;
