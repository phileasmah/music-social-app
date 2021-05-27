import { useRef } from "react";


const TestRateLimit = () => {
  const input = useRef();

  const test = async () => {
    let count = 1
    let res = await run();
    while (res.status == 200) {
      count += 1;
      res = await run(count);
      console.log(count);
    }
    console.log(await res.json());
  }

  const run = async (num) => {
    const res = await fetch(`http://localhost:3000/api/connect`);
    return res;
  }


  return (
    <div>
      <input type="text" ref={input}/>
      <button onClick={test}>Start Test</button>
    </div>
  ) 
}

export default TestRateLimit;