import { Session } from "next-auth";
import { useState } from "react";

interface Props {
  session: Session;
}

const ChangeUsernameInput: React.FC<Props> = ({ session }) => {
  const [username, setUsername] = useState(session.user.id);
  // const [loading, setLoading] = useState(false);
  // const [spaceError, setSpaceError] = useState(false);
  // const [usernameTaken, setUsernameTaken] = useState(false);
  // const [edit, setEdit] = useState(false);

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.value.includes(" ")) {
  //     setSpaceError(true);
  //     return;
  //   }
  //   if (spaceError) {
  //     setSpaceError(false);
  //   }
  //   setUsername(e.target.value);
  // };

  return (
    <div className="grid grid-cols-9 grid-rows-2 py-4 border-b border-lightgrey2">
      <div className="col-span-2 row-span-2 text-xs font-medium tracking-wider my-auto">
        USERNAME
      </div>
      <div className="col-span-3 row-span-2 text-lg text-text my-auto">
        <span>{session.user.id}</span>
        {/* {edit ? (
          <input
            type="text"
            name="username"
            className="bg-lightgrey rounded-md px-3 -mx-3 py-1 -my-1"
            value={username}
            onChange={handleChange}
          />
        ) : (
          <span>{session.user.id}</span>
        )}
        {edit && username !== session.user.id && (
          <button className="absolute ml-6 mt-0.5">
            <ArrowSmRightIcon className="w-6 h-6" />
          </button>
        )} */}
      </div>
      {/* <div className="col-span-3 row-span-2 text-text my-auto">
        <span className="text-red-500">
          {spaceError && edit && !usernameTaken && <>No spaces allowed</>}
          {usernameTaken && <>No spaces allowed</>}
        </span>
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
      </div> */}
    </div>
  );
};

export default ChangeUsernameInput;
