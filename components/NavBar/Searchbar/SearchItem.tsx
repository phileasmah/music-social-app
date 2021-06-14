import Image from "next/image";
import Link from "next/link";
import { AlbumItem, ArtistItem } from "../../../types/SearchType";
import DefaultImage from "../../DefaultImage";

interface Props<T extends "album" | "artist"> {
  search: T;
  item: T extends "album" ? AlbumItem : ArtistItem;
}

const SearchItem = <T extends "album" | "artist">({ search, item }: Props<T>) => {
  return (
    <Link href={`/${search}/${item.id}`} prefetch={false}>
      <a className="flex">
        <div className="flex-none">
          {item.images.length != 0 ? (
            <Image
              src={item.images[0].url}
              alt={"Picture of " + item.name}
              width={77}
              height={77}
              className="rounded-full"
            />
          ) : (
            <DefaultImage />
          )}
        </div>
        <div className="ml-4 my-auto">
          <span className="text-option font-medium">{item.name}</span> <br />
          <span className="text-default">{search === "album" && (item as AlbumItem).artists[0].name}</span>
        </div>
      </a>
    </Link>
  );
};

export default SearchItem;
