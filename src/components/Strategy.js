import React, { useState, useEffect } from 'react';
import { MutatingDots } from 'react-loader-spinner';

function Strategy({ strategy, probability, loading }) {
  const [containerLoaded, setContainerLoaded] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  /// USE EFFECT For container fade-in on mount
  useEffect(() => {
    setContainerLoaded(true);
  }, []);

  /// USE EFFECT For content fade-in when loading completes and practiceProblems exists
  useEffect(() => {
    if (!loading && strategy) {
      setContentLoaded(false);
      const timer = setTimeout(() => setContentLoaded(true), 300);

      return () => clearTimeout(timer);
    }
    setContentLoaded(false);
  }, [loading, strategy]);

  return (
    <div
      className={`p-4 mb-4 rounded-xl shadow-lg bg-gradient-to-l from-[#0f3140] via-[#6f6a98] to-[#978aab] break-words transition-opacity duration-500 ${
        containerLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className='text-3xl font-poppins font-bold mb-2'>Strategy</h2>
      {loading ? (
        <div className='flex justify-center items-center'>
          <MutatingDots
            height={110}
            width={110}
            color='#0f3140'
            secondaryColor='#C2C8C5'
            ariaLabel='mutating-dots-loading'
            radius={15}
            visible={true}
          />
        </div>
      ) : (
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            contentLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className='text-2xl font-poppins bg-[#ffffff]/50 p-4 rounded-3xl flex mb-4 items-center justify-between'>
            {strategy}
          </p>
          <p className='text-xl  font-bold mb-2'>
            Interview Probability: {probability}
          </p>
        </div>
      )}
    </div>
  );
}

export default Strategy;
