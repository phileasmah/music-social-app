import { ArrowSmRightIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ChangeEvent, useState } from "react";


interface Props {
  session: Session;
}

const ChangeDisplayNameInput: React.FC<Props> = ({ session }) => {
  const [currDisplayName, setCurrDisplayName] = useState(session.user.name)
  const [displayName, setDisplayName] = useState(session.user.name);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resSuccess, setResSuccess] = useState<null | boolean>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleClick = async () => {
    setLoading(true);
    const newName = displayName.trim();
    setDisplayName(newName);
    if (newName === currDisplayName) {
      setResSuccess(true);
      setLoading(false);
      return;
    }
    const res = await fetch("/api/user/update-display-name/", {
      method: "POST",
      body: JSON.stringify({
        id: session.user.sub,
        newName: newName,
      }),
    });
    if (res.status == 200) {
      console.log(await getSession());
      setCurrDisplayName(newName);
      setResSuccess(true);
    } else {
      setResSuccess(false);
    }
    setLoading(false);
  };
  console.log(session);
  return (
    <div className="grid grid-cols-9 grid-rows-2 py-4">
      <div className="col-span-2 row-span-2 text-xs font-medium tracking-wider my-auto">
        DISPLAY NAME
      </div>
      <div className="relative col-span-6 row-span-2 text-lg text-text my-auto">
        {edit ? (
          <input
            type="text"
            name="username"
            className="bg-lightgrey rounded-md px-3 -mx-3 py-1 -my-1"
            value={displayName}
            onChange={handleChange}
          />
        ) : (
          <span>{session.user.name}</span>
        )}
        {edit && displayName !== currDisplayName && !loading && (
          <button
            onClick={handleClick}
            className="absolute ml-6 -mt-0.5 p-1 rounded-full duration-200 focus:bg-lightgrey hover:bg-lightgrey"
          >
            <ArrowSmRightIcon className="w-6 h-6" />
          </button>
        )}
        {loading && (
          <svg
            className="absolute top-1.5 left-57.5 animate-spin w-4 h-4 rounded-full bg-transparent border-2 border-transparent border-opacity-50"
            style={{ borderRightColor: "#9CA3AF", borderTopColor: "#9CA3AF" }}
            viewBox="0 0 20 20"
          ></svg>
        )}
        {resSuccess === true && !loading && displayName === currDisplayName && (
          <CheckCircleIcon className="absolute top-1 left-57.5 -ml-0.5 w-5 h-5 text-green-500" />
        )}
        {resSuccess === false && !loading && displayName === currDisplayName && (
          <ExclamationCircleIcon className="absolute top-1 left-57.5 -ml-0.5  w-5 h-5 text-red-500" />
        )}
      </div>
      <div className="col-span-1 row-span-2 my-auto justify-self-end">
        <button
          onClick={() => setEdit(!edit)}
          className={`py-1 px-3 -my-1 border rounded-md hover:bg-lightgrey duration-200 ${
            edit
              ? "text-text bg-blue-600 border-blue-600 hover:border-lightgrey2"
              : "border-lightgrey2"
          }`}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ChangeDisplayNameInput;
