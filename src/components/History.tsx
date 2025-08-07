import React, { useState, useEffect } from 'react';
import ApiFetch from '../apiFetch';
import { MutatingDots } from 'react-loader-spinner';

// Type definitions
interface User {
  name: string;
  email?: string;
  picture?: string;
}

interface PracticeProblem {
  title: string;
  difficulty: string;
  description: string;
  hints?: string[];
}

interface EntryObject {
  title: string;
  prompt: string;
  responseStrategy: string;
  probability: number;
  practiceProblems: PracticeProblem[];
}

interface HistoryItem {
  userName: string;
  problemTitle: string;
  strategy?: string;
  practiceProblems?: any[];
  timestamp?: Date | string;
}

interface HistoryProps {
  loading: boolean;
  entryObj: EntryObject;
  setEntryObj: React.Dispatch<React.SetStateAction<EntryObject>>;
  onClose: () => void;
  refreshHistory: boolean;
  setRefreshHistory: React.Dispatch<React.SetStateAction<boolean>>;
}

const History: React.FC<HistoryProps> = ({
  loading,
  entryObj,
  setEntryObj,
  onClose,
  refreshHistory,
  setRefreshHistory,
}) => {
  const [historyObj, setHistoryObj] = useState<HistoryItem[]>([]);
  const [containerLoaded, setContainerLoaded] = useState<boolean>(false);
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);

  /// USE EFFECT For container fade-in on mount
  useEffect(() => {
    setContainerLoaded(true);
  }, []);

  useEffect(() => {
    if (!loading) {
      setContentLoaded(false);
      const timer = setTimeout(() => setContentLoaded(true), 300);
      return () => clearTimeout(timer);
    }
    setContentLoaded(false);
  }, [loading, historyObj]);

  const getHistoryObject = async (): Promise<void> => {
    try {
      const userItem = localStorage.getItem('user');
      if (!userItem) {
        console.error('No user found in localStorage');
        setHistoryObj([]);
        return;
      }

      const user: User = JSON.parse(userItem);
      if (!user || !user.name) {
        console.error('Invalid user data');
        setHistoryObj([]);
        return;
      }

      const response = await ApiFetch.getHistory(user.name);
      console.log('data in getHistoryObject', response);

      // Handle the response based on the API structure
      if (response && response.history && Array.isArray(response.history)) {
        setHistoryObj(response.history);
      } else if (Array.isArray(response)) {
        setHistoryObj(response);
      } else {
        setHistoryObj([]);
      }

      console.log('historyObj', historyObj);
    } catch (err) {
      console.error(`This is the error in getHistoryObject: ${err}`);
      setHistoryObj([]); // Set historyObj to an empty array on error
    }
  };

  useEffect(() => {
    getHistoryObject();
  }, [entryObj, refreshHistory]);

  const handleMatchTitle = async (title: string): Promise<void> => {
    try {
      console.log('title in handleMatchTitle', title);
      const userItem = localStorage.getItem('user');
      if (!userItem) {
        console.error('No user found in localStorage');
        return;
      }

      const user: User = JSON.parse(userItem);
      if (!user || !user.name) {
        console.error('Invalid user data');
        return;
      }

      const response = await ApiFetch.matchTitle(title, user.name);
      console.log('Requested entry object from Database:', response);

      if (response && response.data) {
        // Map the API response to our EntryObject structure
        const mappedEntry: EntryObject = {
          title: response.data.problemTitle || title,
          prompt: '', // Not available in HistoryObject
          responseStrategy: response.data.strategy || '',
          probability: 0, // Not available in HistoryObject
          practiceProblems: response.data.practiceProblems || [],
        };
        setEntryObj(mappedEntry);
      }
    } catch (err) {
      console.error('This is the error in handleMatchTitle ', err);
    }
  };

  return (
    <div
      className={`h-full p-6 bg-gradient-to-b from-[#022839] to-[#3e3656] overflow-y-auto`}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-[#C2C8C5]'>History</h2>
        <button
          onClick={onClose}
          className='p-2 rounded-full hover:bg-white/10 transition-colors'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-[#C2C8C5]'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center items-center'>
          <MutatingDots
            height={110}
            width={110}
            color='#4A707A'
            secondaryColor='#C2C8C5'
            ariaLabel='mutating-dots-loading'
            radius={15}
            visible={true}
          />
        </div>
      ) : (
        <div className='space-y-4'>
          {Array.isArray(historyObj) && historyObj.length > 0 ? (
            historyObj.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMatchTitle(item.problemTitle)}
                className='w-full text-left p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 text-[#C2C8C5]'
              >
                {item.problemTitle}
              </button>
            ))
          ) : (
            <p className='text-center text-[#C2C8C5]'>No history available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
