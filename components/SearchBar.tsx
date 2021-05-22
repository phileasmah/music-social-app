import { useEffect, useState } from "react";
import useGetApi from "../lib/useGetApi";
import { AlbumItem, ArtistItem, SearchType } from "../types/SearchType";

interface Props {
  token: string;
}

const SearchBar: React.FC<Props> = ({ token }) => {
  const [input, setInput] = useState("");
  const [artists, setArtists] = useState<ArtistItem[] | null | undefined>();
  const [albums, setAlbums] = useState<AlbumItem[] | null | undefined>();
  const [timeout, setTimeOut] = useState<NodeJS.Timeout>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setAlbums(null);
    setArtists(null);
    setError(false);
    if (!input) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const callApi = async () => {
      try {
        const query = encodeURI(input);
        const res = (await useGetApi(
          token,
          "search?q=" + query + "&type=album,artist&limit=3"
        )) as SearchType;
        if (res.albums.total == 0 && res.artists.total == 0) {
          setError(true);
        } else {
          setArtists(res.artists.items);
          setAlbums(res.albums.items);
          console.log(res.artists.items);
        }
        setLoading(false);
        console.log(res);
      } catch (e) {
        console.log(e.response);
      }
    };
    setTimeOut(setTimeout(callApi, 500));
  }, [input]);

  return (
    <div>
      <div className="relative h-10 input-component mb-5 empty m-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full w-full border-gray-300 px-2 transition-all border-blue rounded-sm"
        />
        <label className="absolute left-2 transition-all bg-white px-1">Search for an artist or album</label>
      </div>

      {loading && <div> loading.. </div>}
      <div>
        {artists && <div>Artists:</div>}
        {artists && artists.map((a) => <div key={a.id}>{a.name}</div>)}
      </div>
      <div>
        {albums && <div>Albums:</div>}
        {albums && albums.map((a) => <div key={a.id}>{a.name}</div>)}
      </div>
      {error && <div>No results found</div>}
    </div>
  );
};

export default SearchBar;
