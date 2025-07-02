const apiFetch = {};
apiFetch.requestStrategy = async (query) => {
  // console.log('Making query in apiFetch.requestStrategy: ', query);
  try {
    // console.log('Making query in apiFetch.requestStrategy: ', query);
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userQuery: query }),
    });

    if (!response.ok) {
      throw new Error(
        'Error in generating approach response: ',
        response.status
      );
    }
    // console.log('response strategy before parsing: ', response);
    const data = await response.json();
    // console.log('Here is the generated approach response: ', data);
    return data;
  } catch (err) {
    console.error(`This is the error in apiFetch.requestStrategy : ${err}`);
  }
};

apiFetch.requestPracticeProblems = async (query) => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/practice-problems',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery: query,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(
        'Error in generating practice problems: ',
        response.status
      );
    }
    const data = await response.json();
    console.log('Here are the generated practice problems: ', data);
    return data;
  } catch (err) {
    console.error(
      `This is the error in apiFetch.requestPracticeProblems : ${err}`
    );
  }
};

apiFetch.storeHistoryObj = async (obj) => {
  try {
    console.log('obj in storeHistoryObj apiFetch', obj);
    const response = await fetch('http://localhost:3000/api/storeHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error('Error in storing user history.');
    }
    const data = await response.json();
    console.log(`Here's the history being stored: ${data}`);
  } catch (err) {
    console.error('This is the error in apiFetch.storeHistoryObj', err);
  }
};

apiFetch.getHistory = async (userName) => {
  try {
    console.log('apiFetch');
    const response = await fetch(
      `http://localhost:3000/api/getHistory?userName=${userName}`
    );
    if (!response.ok) {
      throw new Error('Error in getting stored history.');
    }
    const data = await response.json();
    console.log(`Data from backend: ${data}`);
    return data;
  } catch (err) {
    console.error('This is the error in apiFetch.getHistoryObject');
  }
};

apiFetch.matchTitle = async (title, userName) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/matchTitle/${title}?userName=${userName}`
    );

    if (!response.ok) {
      throw new Error('Error in sending over the title');
    }

    const data = await response.json();
    console.log('This the data from backend ', data);
    return data;
  } catch (err) {
    console.error('This is the error in apiFetch.matchTitle', err);
  }
};

export default apiFetch;
