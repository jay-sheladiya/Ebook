import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          Welcome to E-Book Reader
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-center mb-6">
          Discover, read, and bookmark your favorite books. Track progress,
          annotate important sections, and save your favorites.
        </p>
        <Link
          to="/books"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Explore Books
        </Link>
      </div>
    </div>
  );
};

export default Home;
