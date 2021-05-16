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

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setAlbums(null);
    setArtists(null);
    if (!input) {
      setLoading(false);
      return;
    };
    setLoading(true);
    const callApi = async () => {
      try {
        const query = encodeURI(input);
        const res = (await useGetApi(
          token,
          "search?q=" + query + "&type=album,artist&limit=3"
        )) as Search;
        setArtists(res.artists.items);
        setAlbums(res.albums.items);
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
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      {loading ?<div> loading.. </div> : <> </>}
      {artists ? <div>Artists:</div> : <> </>}
      {artists ? artists.map((a) => <div key={a.id}>{a.name}</div>) : <> </>}
      {albums ? <div>Albums:</div> : <> </>}
      {albums ? albums.map((a) => <div key={a.id}>{a.name}</div>) : <> </>}
    </div>
  );
};

export default SearchBar;
