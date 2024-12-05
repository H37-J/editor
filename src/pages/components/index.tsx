import { useFlashMessageContext } from '@/context/FleshMessageContext';
import { useEffect } from 'react';

const Page = () => {
  const showFlashMessage = useFlashMessageContext();

  useEffect(() => {
    showFlashMessage('test', 1000);
  }, []);

  return (
    <>
      <div>test</div>
    </>
  )
}

export default Page;