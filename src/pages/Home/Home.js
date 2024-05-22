import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const randomId = 1;

    localStorage.setItem('id', randomId);
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
