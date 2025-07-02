import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import submitIcon from '../assets/images/up-arrow.png';
import brainIcon from '../assets/images/brain.png';
import '../App.css';

function LandingPage() {
  //create useState that updates empty query
  const [query, setQuery] = useState(''); //query is originally an empty string
  const navigate = useNavigate(); //create a useNav function
  const handleSubmit = (event) => {
    event.preventDefault(); //prevents canceled submission
    console.log('Form is sumbmitted, here is the query: ', query);
    if (!query) {
      return;
      //prevent empty submissions
    }
    //handleClick will only navigate and pass state of query to Dashboard, apiFetch call will happen in Dashboard.js
    navigate('/dashboard', { state: { userQuery: query } }); //userQuery var will be sent to Dashboard.js, use useLocation to extract!
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  return (
    <div className='fade-in'>
      <div className='bg-[#022839] pl-20 pt-10 pb-10'>
        <div className='flex items-center gap-4'>
          <h1 className='text-5xl font-bold text-[#C2C8C5]'>AlgoPlaces</h1>
          <img
            src={brainIcon}
            alt='brain icon'
            className='h-12 w-12 object-contain filter brightness-90 invert opacity-80'
          />
        </div>
      </div>

      <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-[#022839]  to-[#3e3656] pb-60'>
        <div className='text-center w-full max-w-7xl mx-auto px-4'>
          <main className='mb-8'>
            <h1 className='font-poppins text-5xl font-bold text-[#C2C8C5] mb-4'>
              Whatcha workin' on?
            </h1>
          </main>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col items-center gap-4'
          >
            <div className='relative w-full max-w-[800px] min-w-[400px] max-h-[600px] mx-auto'>
              <textarea
                type='text'
                value={query}
                onChange={handleInputChange}
                placeholder="Tell us your problem, we'll help ya!"
                className='text-lg font-poppins w-full h-24 rounded-3xl p-3 pr-32 bg-gradient-to-l from-[#94B0B7] to-[#C2C8C5] focus:outline-none focus:ring-2 focus:ring-[#4A707A]'
              />
              <button
                type='submit'
                className='absolute right-2 bottom-2 px-4 py-2 rounded-full hover:scale-110 transition-transform duration-200 bg-[#022839]'
              >
                <img
                  src={submitIcon}
                  alt='Submit'
                  className='h-6 w-6 brightness-0 invert'
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
