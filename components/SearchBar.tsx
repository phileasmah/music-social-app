import { XCircleIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
import useGetApi from "../lib/useGetApi";
import { ApiContextProvider } from "../types/ApiContextProvider";
import { AlbumItem, ArtistItem, SearchType } from "../types/SearchType";
import { ApiContext } from "./Contexts/ApiContext";
import SearchItem from "./SearchItem";

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [artists, setArtists] = useState<ArtistItem[] | null | undefined>();
  const [albums, setAlbums] = useState<AlbumItem[] | null | undefined>();
  const [timeout, setTimeOut] = useState<NodeJS.Timeout>();
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState(-1);
  const [albumLength, setAlbumLength] = useState(0);

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (!input || !clientToken) {
      setAlbums(null);
      setArtists(null);
      setCount(0);
      return;
    }
    setError(false);
    const callApi = async () => {
      const query = encodeURI(input);
      const response = await useGetApi<SearchType>(
        clientToken?.access_token,
        "search?q=" + query + "&type=album,artist&limit=3"
      );
      const res = response.data;
      if (res.albums.total == 0 && res.artists.total == 0) {
        setError(true);
      } else {
        if (res.artists.total != 0) {
          setArtists(res.artists.items);
        }
        if (res.albums.total != 0) {
          setAlbums(res.albums.items);
        }
      }
      setCount(res.albums.items.length + res.artists.items.length);
      setAlbumLength(res.albums.items.length);
      setCursor(-1);
    };
    setTimeOut(setTimeout(callApi, 500));
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (count === 0) return;
    if (e.code === "ArrowDown") {
      if (cursor === count - 1) {
        setCursor(0);
      } else {
        setCursor(cursor + 1);
      }
    } else if (e.code === "ArrowUp") {
      if (cursor === 0 || cursor === -1) {
        setCursor(count - 1);
      } else {
        setCursor(cursor - 1);
      }
    } else if (e.code === "Enter") {
      if (cursor === -1) return;
      if (cursor < albumLength && albums) {
        router.push("album/" + albums[cursor].id);
      } else if (artists) {
        router.push("artist/" + artists[cursor - albumLength].id);
      }
    }
  };

  return (
    <div className="absolute z-10 top-4 right-5 w-11/12 sm:w-1/3">
      <div className="relative">
        {show && (artists || albums || error) && (
          <button
            onClick={() => setShow(false)}
            className="absolute h-5 w-5 right-6 top-1/2 -mt-2.5 text-input"
          >
            <XCircleIcon />
          </button>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for artist or album"
          className="h-full w-full border-gray-300 py-3 px-6 rounded-3xl duration-200 transition-all"
          onFocus={() => setShow(true)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {show && (count !== 0 || error) && (
        <div className="bg-lightgrey -mt-5 z-20 pt-5 pb-2 rounded-b-3xl px-6">
          {error && <div className="my-3">No results found</div>}
          {albums && (
            <div className="mb-3">
              <hr className="mb-1" />
              <b> Albums:</b>
              <ul>
                {albums.map((album, idx) => (
                  <li
                    className={
                      cursor === idx
                        ? "bg-darkgrey p-1 px-2 rounded-lg duration-300"
                        : "p-0 duration-300"
                    }
                  >
                    <SearchItem search={"album"} item={album} key={"album" + album.id} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {artists && (
            <div className="mb-5">
              <hr className="mb-1" />
              <b>Artists:</b>
              <ul>
                {artists.map((artist, idx) => (
                  <li
                    className={
                      cursor === idx + albumLength
                        ? "bg-darkgrey p-2 rounded-lg"
                        : "p-0 duration-300"
                    }
                  >
                    <SearchItem search={"artist"} item={artist} key={"artist" + artist.id} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
