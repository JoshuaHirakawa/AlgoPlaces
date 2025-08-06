// API response type definitions
interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
}

interface StrategyResponse {
  approach?: string;
  steps?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface PracticeProblemsResponse {
  problems?: Array<{
    title: string;
    difficulty: string;
    description: string;
    hints?: string[];
  }>;
}

interface HistoryObject {
  userName: string;
  problemTitle: string;
  strategy?: string;
  practiceProblems?: any[];
  timestamp?: Date | string;
}

interface HistoryResponse {
  history?: HistoryObject[];
  userName?: string;
}

interface MatchTitleResponse {
  match?: boolean;
  data?: HistoryObject;
}

class ApiFetch {
  private static readonly BASE_URL = 'http://localhost:3000/api';

  static async requestStrategy(
    query: string
  ): Promise<StrategyResponse | undefined> {
    try {
      const response = await fetch(`${this.BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuery: query }),
      });

      if (!response.ok) {
        throw new Error(
          `Error in generating approach response: ${response.status}`
        );
      }

      const data: StrategyResponse = await response.json();
      return data;
    } catch (err) {
      console.error(`This is the error in apiFetch.requestStrategy: ${err}`);
      return undefined;
    }
  }

  static async requestPracticeProblems(
    query: string
  ): Promise<PracticeProblemsResponse | undefined> {
    try {
      const response = await fetch(`${this.BASE_URL}/practice-problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery: query,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error in generating practice problems: ${response.status}`
        );
      }

      const data: PracticeProblemsResponse = await response.json();
      console.log('Here are the generated practice problems: ', data);
      return data;
    } catch (err) {
      console.error(
        `This is the error in apiFetch.requestPracticeProblems: ${err}`
      );
      return undefined;
    }
  }

  static async storeHistoryObj(obj: HistoryObject): Promise<void> {
    try {
      console.log('obj in storeHistoryObj apiFetch', obj);
      const response = await fetch(`${this.BASE_URL}/storeHistory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });

      if (!response.ok) {
        throw new Error('Error in storing user history.');
      }

      const data: ApiResponse = await response.json();
      console.log(`Here's the history being stored:`, data);
    } catch (err) {
      console.error('This is the error in apiFetch.storeHistoryObj', err);
    }
  }

  static async getHistory(
    userName: string
  ): Promise<HistoryResponse | undefined> {
    try {
      console.log('apiFetch');
      const response = await fetch(
        `${this.BASE_URL}/getHistory?userName=${encodeURIComponent(userName)}`
      );

      if (!response.ok) {
        throw new Error('Error in getting stored history.');
      }

      const data: HistoryResponse = await response.json();
      console.log(`Data from backend:`, data);
      return data;
    } catch (err) {
      console.error('This is the error in apiFetch.getHistory', err);
      return undefined;
    }
  }

  static async matchTitle(
    title: string,
    userName: string
  ): Promise<MatchTitleResponse | undefined> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/matchTitle/${encodeURIComponent(
          title
        )}?userName=${encodeURIComponent(userName)}`
      );

      if (!response.ok) {
        throw new Error('Error in sending over the title');
      }

      const data: MatchTitleResponse = await response.json();
      console.log('This the data from backend ', data);
      return data;
    } catch (err) {
      console.error('This is the error in apiFetch.matchTitle', err);
      return undefined;
    }
  }
}

export default ApiFetch;
