import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";

interface RouterQuery extends ParsedUrlQuery {
  slug: string;
  albumId: string;
  albumName: string;
  artist: string;
}

const Comment = () => {
  const router = useRouter();
  const routerQuery = router.query as RouterQuery;

  useEffect(() => {
    if (!routerQuery || Object.keys(routerQuery).length == 0) return
    console.log(routerQuery);
  }, [routerQuery]);

  return <></>;
};

export default Comment;
