import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../components/Contexts/ApiContext";
import useGetApi from "../../lib/useGetApi";
import { AlbumInfo } from "../../types/AlbumInfo";
import { ApiContextProvider } from "../../types/ApiContextProvider";


const Album: React.FC = () => {
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;
  const router = useRouter();
  const query = router.query;
  const [data, setData] = useState<AlbumInfo | null>(null);

  useEffect(() => {
    if (!clientToken || !query.slug) return;
    const getData = async () => {
      const res = await useGetApi(clientToken?.access_token,`albums/${query.slug}`) as AlbumInfo
      setData(res);
    };
    getData();
  }, [clientToken]);

  return (
    <div>
      {data && <div>{data.name}</div>}
    </div>
  );
};

export default Album;
