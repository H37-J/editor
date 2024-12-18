import { useEffect, useState } from 'react';

const Compo = () => {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
  }, [count])

  return (
    <>
      <div onClick={() => setCount(count + 1)}>+1</div>
      <div onClick={() => setCount(count - 1)}>-1</div>
      <div onClick={() => setShow(!show)}>보기</div>
      <div>Count: {count}</div>
      {show && <div>show: show</div>}
    </>
  );
};

const Page = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Compo />
      <Compo />
    </>
  );
};

export default Page;