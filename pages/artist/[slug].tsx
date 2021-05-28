import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { ApiContext } from "../../components/Contexts/ApiContext";
import { AlbumInfo } from "../../types/AlbumInfo";
import { ApiContextProvider } from "../../types/ApiContextProvider";


const Artist: React.FC = () => {
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;
  const router = useRouter();
  const query = router.query;
  const [data, setData] = useState<AlbumInfo | null>(null);

  // useEffect(() => {
  //   if (!clientToken || !query.slug) return;
  //   const getData = async () => {
  //     const res = await useGetApi<AlbumInfo>(clientToken?.access_token,`albums/${query.slug}`)
  //     const response = res.data;
  //     setData(response);
  //   };
  //   getData();
  // }, [clientToken]);

  return (
    <div>
      {query.slug}
    </div>
  );
};

export default Artist;
