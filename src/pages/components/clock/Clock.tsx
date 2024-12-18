import { useEffect, useState } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString())
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="text-sm fixed bottom-0 right-0 m-4">
      <p>{currentTime}</p>
    </div>
  );
}

export default Clock;