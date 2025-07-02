// import mongoose from 'mongoose';

// const practiceProblemSchema = new mongoose.Schema({
//   problem: {
//     type: String,
//     required: true,
//   },
//   isCompleted: {
//     type: Boolean,
//     default: false,
//   },
// });

// // const userSchema = new mongoose.Schema({
// //   username: { string },
// //   userHistory: [userProgressSchema],
// // });

// const userProgressSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   prompt: {
//     type: String,
//     required: true,
//   },
//   responseStrategy: {
//     type: String,
//     required: true,
//   },
//   practiceProblems: [practiceProblemSchema],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   probability: {
//     type: String,
//     required: true,
//   },
// });

// const UserProgress = mongoose.model('UserProgress', userProgressSchema);
// // const User = mongoose.model('User', userSchema);

// export default UserProgress;

import mongoose from 'mongoose';

const practiceProblemSchema = new mongoose.Schema({
  problem: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const entrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  responseStrategy: {
    type: String,
    required: true,
  },
  practiceProblems: [practiceProblemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  probability: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userHistory: [entrySchema],
});

const Entry = mongoose.model('Entry', entrySchema);
const User = mongoose.model('User', userSchema);

export { Entry, User };
