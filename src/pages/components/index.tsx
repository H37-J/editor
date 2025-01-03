import { useEffect, useLayoutEffect, useState } from 'react';
import { debounce } from 'next/dist/server/utils';

const Compo = () => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = debounce((value) => {
    setInputValue(value); // 입력값을 상태에 반영
  }, 300); // 300ms 후에 상태 업데이트

  return (
    <div>
      <input
        type="text"
        placeholder="여기에 입력하세요..."
      />
      <p>입력한 값: {inputValue}</p>
    </div>
  );
};

const Page = () => {

  return (
    <>
      <Compo />
    </>
  );
};

export default Page;