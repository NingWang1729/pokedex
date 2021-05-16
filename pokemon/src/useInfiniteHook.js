import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback) => {
  const [loading, setloading] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!loading) return;
    callback(() => {
      console.log('called back');
    });
  }, [loading]);

  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    setloading(true);
  }

  return [loading, setloading];
};

export default useInfiniteScroll;