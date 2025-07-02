import React, { useState, useEffect } from 'react';
import { MutatingDots } from 'react-loader-spinner';

function PracticeProblem({
  practiceProblems,
  loading,
  setPracticeProblems,
  setEntryObj,
  entryObj,
}) {
  // console.log("I am the setpracticeProblems props inside of PracticeProblem component: ", {setPracticeProblems})
  // console.log(`This is practiceProblems inside PracticeProblem component. Am I defined? Hm...: ${JSON.stringify(practiceProblems, null, 2)}`)
  // console.log(`This is the entryObj object inside PracticeProblem component. Am I updating? Hm...... :${JSON.stringify(entryObj, null, 2)}`)
  const [containerLoaded, setContainerLoaded] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  /// USE EFFECT For container fade-in on mount
  useEffect(() => {
    setContainerLoaded(true);
  }, []);

  /// USE EFFECT For content fade-in when loading completes and practiceProblems exists
  useEffect(() => {
    if (!loading && practiceProblems.length > 0) {
      setContentLoaded(false);
      const timer = setTimeout(() => setContentLoaded(true), 300);
      return () => clearTimeout(timer);
    }
    setContentLoaded(false);
  }, [loading, practiceProblems]);

  //?create handler to set isCompleted to true if checkbox is clicked
  const handleCheckmark = async (clickedBox) => {
    //clickedBox is being identified by its ID, which is the index
    //toggle problem.isCompleted to true (use ! i think no true since we want to able to uncheck)
    //use functional state handler to change state of problem array
    // setPracticeProblems((prev) =>
    //   prev.map((problem, i) =>
    //     i === clickedBox
    //       ? { ...problem, isCompleted: !problem.isCompleted }
    //       : problem
    //   )
    // );

    await setEntryObj((prev) => ({
      ...prev,
      practiceProblems: prev.practiceProblems.map((problemObj, index) =>
        index === clickedBox
          ? { ...problemObj, isCompleted: !problemObj.isCompleted }
          : problemObj
      ),
    }));
  };

  return (
    <div
      className={`p-4 mb-4 rounded-xl shadow-lg bg-gradient-to-l from-[#0f3140] via-[#6f6a98] to-[#978aab] break-words transition-opacity duration-500 max-h-[1000px] overflow-hidden ${
        containerLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className='text-3xl font-poppins font-bold mb-2'>
        Practice Problems
      </h2>
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
        <ul
          className={`
            transition-all 
            duration-500 
            ease-in-out 
            transform 
            overflow-y-auto 
            max-h-[800px] 
            pr-4
            scrollbar-thin
            scrollbar-thumb-[#4A707A]
            scrollbar-track-transparent
            scrollbar-thumb-rounded-full
            hover:scrollbar-thumb-[#4A707A]/80
            ${contentLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {practiceProblems.map((problem, index) => (
            <div
              key={index}
              className='bg-[#ffffff]/50  p-4  rounded-3xl flex mb-4 items-center '
            >
              <label
                htmlFor={`checkbox-${index}`}
                className={`cursor-pointer min-w-4 min-h-4 w-6 h-6 pr-6 ml-4 border-2 border-[#4A707A] rounded-full flex items-center justify-center transition-all duration-200 
                  ${
                    problem.isCompleted
                      ? 'bg-[#4A707A]'
                      : 'hover:bg-[#4A707A]/10'
                  }`}
              >
                {problem.isCompleted && (
                  <svg
                    className='w-4 h-4 text-white'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
                  </svg>
                )}
              </label>
              <li className='pl-6 text-lg font-poppins'>{problem.problem}</li>
              <input
                type='checkbox'
                id={`checkbox-${index}`}
                checked={problem.isCompleted}
                onChange={() => handleCheckmark(index)}
                className='hidden'
              />{' '}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PracticeProblem;
