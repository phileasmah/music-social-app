import { useContext, useEffect, useState } from "react";
import useGetApi from "../lib/useGetApi";
import { ApiContextProvider } from "../types/ApiContextProvider";
import { AlbumItem, ArtistItem, SearchType } from "../types/SearchType";
import AlbumSearchItem from "./AlbumSearchItem";
import ArtistSearchItem from "./ArtistSearchItem";
import { ApiContext } from "./Contexts/ApiContext";

const SearchBar: React.FC = () => {
  const [input, setInput] = useState("");
  const [artists, setArtists] = useState<ArtistItem[] | null | undefined>();
  const [albums, setAlbums] = useState<AlbumItem[] | null | undefined>();
  const [timeout, setTimeOut] = useState<NodeJS.Timeout>();
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (!input || !clientToken) {
      setAlbums(null);
      setArtists(null);
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
    };
    setTimeOut(setTimeout(callApi, 500));
  }, [input]);

  return (
    <div className="absolute z-10 top-4 right-5 w-11/12 sm:w-1/3">
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for artist or album"
          className="h-full w-full border-gray-300 py-3 px-6 rounded-3xl duration-200 transition-all"
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
        />
      </div>
      {show && (artists || albums || error) && (
        <div className="bg-lightgrey -mt-5 z-20 pt-5 pb-2 rounded-b-3xl px-6">
          <hr />
          <div className="my-3">
            {error && <div>No results found</div>}
            {artists && <b>Artists:</b>}
            {artists && artists.map((artist) => <ArtistSearchItem item={artist} key={artist.id} />)}
          </div>
          <hr />
          <div className="my-3">
            {albums && <b>Albums:</b>}
            {albums && albums.map((album) => <AlbumSearchItem item={album} key={album.id} />)}{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
