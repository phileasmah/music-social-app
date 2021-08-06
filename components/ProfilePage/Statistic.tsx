import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  statistic: number;
  name: string;
  link?: string;
}

const Statistic: React.FC<Props> = ({ statistic, name, link = "" }) => {
  const router = useRouter();

  return (
    <div>
      {link ? (
        <Link href={`${router.asPath}/${link}`}>
          <div className="flex flex-col">
            <a className="font-light">{name}</a>
            <span className="font-semibold text-2xl flex justify-center">{statistic}</span>
          </div>
        </Link>
      ) : (
        <div className="flex flex-col">
          <h2 className="font-light">{name}</h2>
          <span className="font-semibold text-2xl flex justify-center">{statistic}</span>
        </div>
      )}
    </div>
  );
};

export default Statistic;
