import { SearchIcon, XCircleIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import useGetApi from "../../../lib/useGetApi";
import { ApiContextProvider } from "../../../types/ApiContextProvider";
import { AlbumItem, SearchType } from "../../../types/SearchType";
import { ApiContext } from "../../Contexts/ApiContext";
import SearchItem from "./SearchItem";

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [albums, setAlbums] = useState<AlbumItem[] | null | undefined>();
  const [timeout, setTimeOut] = useState<NodeJS.Timeout>();
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef === null) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (!input || !clientToken) {
      setAlbums(null);
      setCount(0);
      return;
    }
    setError(false);
    const callApi = async () => {
      const query = encodeURI(input);
      const response = await useGetApi<SearchType>(
        clientToken?.access_token,
        "search?q=" + query + "&type=album&limit=5"
      );
      const res = response.data;
      if (res.albums.total == 0) {
        setError(true);
        setAlbums(null);
      } else {
        setAlbums(res.albums.items);
      }
      setCount(res.albums.items.length);
      setCursor(-1);
    };
    setTimeOut(setTimeout(callApi, 500));
  }, [input]);

  useEffect(() => {
    const handleRouteChange = () => {
      setShow(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (count === 0) return;
    switch (e.code) {
      case "ArrowDown":
        if (cursor === count - 1) {
          setCursor(0);
        } else {
          setCursor(cursor + 1);
        }
        break;
      case "ArrowUp":
        if (cursor === 0 || cursor === -1) {
          setCursor(count - 1);
        } else {
          setCursor(cursor - 1);
        }
        break;
      case "Enter":
        if (cursor === -1) return;
        if (albums) {
          router.push("/album/" + albums[cursor].id);
        }
        break;
      case "Escape":
        setShow(false);
    }
  };

  return (
    <div
      className="absolute z-10 top-2 left-3 md:left-40 lg:left-60 w-11/12 lg:w-2/5 sm:w-1/2"
      ref={wrapperRef}
    >
      <div className="relative">
        <SearchIcon className="absolute h-5 w-5 top-1/2 -mt-2.5 left-5 text-input" />
        {show && (albums || error) && (
          <button
            onClick={() => {
              setShow(false);
              setInput("");
            }}
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
          className={`h-full w-full text-option bg-lightgrey focus:bg-lightgrey py-3 pl-12 pr-6 border ${show ? "border-lightgrey" : "border-darkgrey"} rounded-md focus:rounded-full focus:"border-white" align-middle`}
          onClick={() => setShow(true)}
          onKeyDown={handleKeyDown}
          tabIndex= {2}
        />
      </div>
      {show && (count !== 0 || error) && (
        <div className="bg-lightgrey -mt-5 pt-5 pb-2 rounded-b-xl">
          <hr className="mb-1 border-lightgrey2 border-t-2" />
          {error ? (
            <div className="px-6 my-3">No results found</div>
          ) : (
            <>
              {albums && (
                <div className="mb-3">
                  <b className="px-6"> Albums:</b>
                  <ul className="px-6">
                    {albums.map((album, idx) => (
                      <li
                        className={`duration-300 my-2 text-option hover:bg-darkgrey hover:p-3 hover:rounded-lg  ${
                          cursor === idx ? "bg-darkgrey p-3 rounded-lg" : "p-0"
                        }`}
                        key={"album" + album.id}
                      >
                        <SearchItem search={"album"} item={album} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}{" "}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
