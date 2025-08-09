import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PracticeProblem from './PracticeProblem';
import Strategy from './Strategy';
import History from './History';
import InputProblem from './InputProblem';
import ApiFetch from '../apiFetch';
import { googleLogout } from '@react-oauth/google';
import brainIcon from '../assets/images/brain.png';
import plusIcon from '../assets/images/plus.png';
import historyIcon from '../assets/images/history.png';
import logoutIcon from '../assets/images/log-out.png';
import '../App.css';

// Type definitions
interface LocationState {
  userQuery: string;
}

interface User {
  name: string;
  email?: string;
  picture?: string;
}

interface PracticeProblemData {
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
  practiceProblems: PracticeProblemData[];
}

// API response types to match the actual backend
interface ApiStrategyResponse {
  title?: string;
  prompt?: string;
  responseStrategy?: string;
  probability?: number;
  approach?: string;
  steps?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Type assertion for location state
  const { userQuery } = (location.state as LocationState) || { userQuery: '' };

  // State with proper types
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [strategy, setStrategy] = useState<string>('');
  const [probability, setProbability] = useState<string>('');
  const [practiceProblems, setPracticeProblems] = useState<
    PracticeProblemData[]
  >([]);
  const [prompt, setPrompt] = useState<string>('');
  const [entryObj, setEntryObj] = useState<EntryObject>({
    title: '',
    prompt: '',
    responseStrategy: '',
    probability: 0,
    practiceProblems: [],
  });
  const [historyObjIsComplete, setHistoryObjIsComplete] =
    useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [refreshHistory, setRefreshHistory] = useState<boolean>(false);

  /// on mount, extract user name from localStorage and save to useState
  useEffect(() => {
    const userItem = localStorage.getItem('user');
    if (!userItem) {
      console.log(
        'No user Identified, Please go back to login page and try again.'
      );
      return;
    }

    try {
      const user: User = JSON.parse(userItem);
      if (!user || !user.name) {
        console.log(
          'No user Identified, Please go back to login page and try again.'
        );
        return;
      }
      setUserName(user.name);
      console.log('extracted user:', user.name);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  }, []);

  console.log('This is the query sent to us from da landing page: ', userQuery);

  /// HANDLER FUNCTION TO LOGOUT
  const handleLogout = (): void => {
    googleLogout();
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStrategy = async (): Promise<void> => {
    setLoading(true);

    try {
      const result = (await ApiFetch.requestStrategy(
        userQuery
      )) as ApiStrategyResponse;
      console.log('result', result);

      if (result) {
        console.log('generated strategy:', result.responseStrategy);
        setTitle(result.title || '');
        setStrategy(result.responseStrategy || '');
        setProbability(result.probability?.toString() || '');
        setPrompt(result.prompt || '');

        // Use a functional state update to update the history object
        setEntryObj((prev) => ({
          ...prev,
          title: result.title || '',
          prompt: result.prompt || '',
          responseStrategy: result.responseStrategy || '',
          probability: result.probability || 0,
        }));
      }
    } catch (error) {
      console.error('Error in getStrategy:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPracticeProblems = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await ApiFetch.requestPracticeProblems(userQuery);
      console.log('generated practice problems: ', result);
      console.log('result.problems:', result?.problems);
      console.log('typeof result:', typeof result);

      if (result && result.problems) {
        console.log('Setting practice problems:', result.problems);
        setPracticeProblems(result.problems);
        setEntryObj((prev) => ({
          ...prev,
          practiceProblems: result.problems || [],
        }));
        setHistoryObjIsComplete(true);
      } else {
        console.log('No problems found in result');
      }
    } catch (err) {
      console.error(`This is the error in getPracticeProblems: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const storeHistory = async (): Promise<void> => {
    // Function that runs once the entry object has all the parameters
    try {
      console.log('entryObj to store in DB', entryObj);
      const response = await ApiFetch.storeHistoryObj({
        userName,
        problemTitle: entryObj.title,
        strategy: entryObj.responseStrategy,
        practiceProblems: entryObj.practiceProblems,
        timestamp: new Date().toISOString(),
      });
      console.log('response from storing history:', response);
      setRefreshHistory(true);
    } catch (err) {
      console.error(`This is the error in storingHistory: ${err}`);
    }
  };

  /// HANDLER TO NAVIGATE TO LANDING PAGE FOR NEW PROMPT
  const handleNewPrompt = (): void => {
    navigate('/landingpage');
  };

  useEffect(() => {
    if (userQuery) {
      getStrategy();
    }
  }, [userQuery]);

  useEffect(() => {
    /// make sure we only generate practiceProblems on initial Load/ redirect from landing page
    if (strategy && initialLoad) {
      getPracticeProblems();
      setInitialLoad(false);
    }
  }, [strategy, initialLoad]);

  useEffect(() => {
    console.log('practiceProblems state:', practiceProblems);
  }, [practiceProblems]);

  useEffect(() => {
    // Stores history object in database when ready
    console.log('history updated: ', entryObj);
    if (historyObjIsComplete || entryObj.practiceProblems.length > 0) {
      // Condition to check before calling the fetch function
      setHistoryObjIsComplete(false);
      storeHistory();
    }

    if (!initialLoad) {
      setTitle(entryObj.title);
      setStrategy(entryObj.responseStrategy);
      setProbability(entryObj.probability.toString());
      setPracticeProblems(entryObj.practiceProblems);
      setPrompt(entryObj.prompt);
    }
  }, [entryObj, historyObjIsComplete, initialLoad]);

  return (
    <div className='relative fade-in'>
      <div className='w-full h-full bg-[#022839] pb-10 pt-6 pl-20 pr-20 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <h1 className='text-5xl font-bold text-[#C2C8C5]'>AlgoPlaces</h1>
          <img
            src={brainIcon}
            alt='brain icon'
            className='h-12 w-12 object-contain filter brightness-90 invert opacity-80'
          />
        </div>
        <div className='flex items-center gap-3'>
          {/* Add New Button */}
          <button
            onClick={handleNewPrompt}
            className='p-2 rounded-full bg-[#4A707A] hover:bg-[#4A707A]/80 transition-all duration-200'
          >
            <div className='h-8 w-8 flex items-center justify-center'>
              <img
                src={plusIcon}
                alt='New Prompt'
                className='h-4 w-4 object-contain filter brightness-90 invert opacity-80'
              />
            </div>
          </button>
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className='p-2 rounded-full bg-[#4A707A] hover:bg-[#4A707A]/80 transition-all duration-200'
          >
            <div className='h-8 w-8 flex items-center justify-center'>
              <img
                src={historyIcon}
                alt='History'
                className='h-6 w-6 object-contain filter brightness-90 invert opacity-80'
              />
            </div>
          </button>
          <button
            onClick={handleLogout}
            className='p-2 rounded-full bg-[#4A707A] hover:bg-[#4A707A]/80 transition-all duration-200'
          >
            <div className='h-8 w-8 flex items-center justify-center'>
              <img
                src={logoutIcon}
                alt='Sign Out'
                className='h-7 w-7 object-contain filter brightness-90 invert opacity-80'
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`px-20 min-h-screen transition-all duration-300 ease-in-out ${
          isHistoryOpen ? 'pr-[384px]' : ''
        }`}
      >
        <div className='grid grid-cols-2 gap-10 transition-opacity duration-500 opacity-100'>
          <div className='col-span-1'>
            <InputProblem inputProblem={prompt} title={title} />
            <Strategy
              strategy={strategy}
              probability={probability}
              loading={loading}
            />
          </div>
          <div className='col-span-1'>
            <PracticeProblem
              practiceProblems={practiceProblems}
              setPracticeProblems={setPracticeProblems}
              loading={loading}
              setEntryObj={setEntryObj}
              entryObj={entryObj}
            />
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-96 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='h-full flex'>
          <div className='w-6'></div>
          <div className='flex-1 bg-gradient-to-b from-[#022839] to-[#3e3656]'>
            <History
              loading={loading}
              entryObj={entryObj}
              setEntryObj={setEntryObj}
              onClose={() => setIsHistoryOpen(false)}
              refreshHistory={refreshHistory}
              setRefreshHistory={setRefreshHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
