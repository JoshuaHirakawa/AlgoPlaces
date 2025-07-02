import React from 'react';

function InputProblem({ inputProblem, title }) {
  return (
    <div className='p-4 mb-4 rounded-lg shadow-lg bg-[#ffffff]/70 break-words'>
      <h2 className='text-3xl font-poppins font-bold mb-2'>
        <span
          className={`transition-all duration-500 ease-in-out ${
            title ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title || 'Your Prompt'}
        </span>
      </h2>
      <p className='text-xl font-poppins font-open-sans'>{inputProblem}</p>
    </div>
  );
}

export default InputProblem;
