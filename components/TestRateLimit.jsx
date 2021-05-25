import { useRef } from "react";


const TestRateLimit = () => {
  const input = useRef();
  const axios = require("axios");

  const test = async () => {
    let count = 1
    let res = await run(1);
    while (res.status == 200) {
      count += 1;
      res = await run(count);
    }
    console.log(res);
    console.log(count);
  }

  const run = async (num) => {
    const res = await axios.get(`https://api.spotify.com/v1/search?q=${num}&type=artist`, {
      headers: { Authorization: "Bearer " + input.current.value },
    });
    return(res);
  }


  return (
    <div>
      <input type="text" ref={input}/>
      <button onClick={test}>Start Test</button>
    </div>
  ) 
}

export default TestRateLimit;