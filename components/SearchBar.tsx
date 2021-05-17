import { useEffect, useState } from "react";
import useGetApi from "../lib/useGetApi";
import { AlbumItem, ArtistItem, Search } from "../types/Search";

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
        )) as Search;
        if (res.albums.total == 0 && res.artists.total == 0) {
          setError(true);
        } else {
          setArtists(res.artists.items);
          setAlbums(res.albums.items);
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
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search for an artist or album" className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>
      {loading ? <div> loading.. </div> : <> </>}
      <div>
        {artists ? <div>Artists:</div> : <> </>}
        {artists ? artists.map((a) => <div key={a.id}>{a.name}</div>) : <> </>}
      </div>
      <div>
        {albums ? <div>Albums:</div> : <> </>}
        {albums ? albums.map((a) => <div key={a.id}>{a.name}</div>) : <> </>}
      </div>
      {error ? <div>No results found</div> : <> </>}
    </div>
  );
};

export default SearchBar;
