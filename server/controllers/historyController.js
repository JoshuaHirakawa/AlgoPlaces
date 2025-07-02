import { Entry, User } from '../models/userProgressModel.js';

const storeHistory = async (req, res, next) => {
  console.log('storeHistory request body:', req.body);
  try {
    const {
      title,
      prompt,
      responseStrategy,
      practiceProblems,
      probability,
      userName,
    } = req.body;

    console.log('Received storeHistory request with data:', {
      title,
      prompt,
      responseStrategy,
      practiceProblems,
      probability,
      userName,
    });

    if (
      !title ||
      !prompt ||
      !responseStrategy ||
      !practiceProblems ||
      !probability ||
      !userName
    ) {
      console.error('Missing required fields in storeHistory request');
      return res
        .status(400)
        .json({ error: 'History object is not in correct format' });
    }

    const historyObject = new Entry({
      title,
      prompt,
      responseStrategy,
      practiceProblems,
      probability,
    });

    const user = await User.findOne({ userName });

    if (user) {
      const existingHistory = user.userHistory.find(
        (history) => history.title === title
      );

      if (existingHistory) {
        existingHistory.prompt = prompt;
        existingHistory.responseStrategy = responseStrategy;
        existingHistory.practiceProblems = practiceProblems;
        existingHistory.probability = probability;
      } else {
        user.userHistory.push(historyObject);
      }

      await user.save();
      console.log('User history updated successfully');
    } else {
      const newUser = new User({
        userName,
        userHistory: [historyObject],
      });
      await newUser.save();
      console.log('New user created and history saved successfully');
    }

    return res.status(200).json({ message: 'History updated successfully' });
  } catch (error) {
    console.error('Error in storeHistory:', error);
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const { userName } = req.query;
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const history = user.userHistory;
    res.locals.history = history;
    return res.status(200).json(res.locals.history);
  } catch (error) {
    console.error('Error in getHistory:', error);
    next(error);
  }
};

const getTitle = async (req, res, next) => {
  try {
    const { title } = req.params;
    const { userName } = req.query;
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const data = user.userHistory.find((history) => history.title === title);

    if (!data) {
      return res.status(404).json({ error: 'Title not found' });
    }

    res.locals.titleData = data;
    return res.status(200).json(res.locals.titleData);
  } catch (error) {
    console.error('Error in getTitle:', error);
    next(error);
  }
};

export { storeHistory, getHistory, getTitle };
