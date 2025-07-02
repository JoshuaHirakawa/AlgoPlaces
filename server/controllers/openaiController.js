import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateStrategy = async (req, res, next) => {
  try {
    const { userQuery } = res.locals;

    console.log('userQuery:', userQuery);

    const aiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: `You are a 10x tutor for AlgoPlaces, a world-renowned code tutoring service. You are tasked with receiving a user-inputted problem and providing a step-by-step, clear strategy to solve it. The prompt is not the user speaking to you, so don't respond as if you are being asked a direct question. Simply give a high-level, clear solution in casual language. DO NOT GIVE THE ANSWER. Do not berate or make fun of the user. Do not use foul language or inappropriate innuendos. Do not flirt with the user. Do not be condescending. Do not stray off-topic of what the question is. Provide context behind the solution and the reason why this strategy is the optimal way to go about the problem. In the end, recommend more resources the user can refer to, to gain more insight on the problem. Be kind, professional, and represent the company well, but also take a casual tone like you're tutoring a friend. You want the user to feel at ease as if they were talking to a buddy, not a robot. If you do, you might get a 10 cent raise against inflation. If you don't, you will be fired from AlgoPlaces and be forced to work for CatSnake corp, a terrible company that you will be miserable in. All your responses must `,
        },
        {
          role: 'user',
          content: `Generate a high-level strategy on how to solve the following problem: ${userQuery}. In your response, there is no need to confirm that you can help with the task. Just give a title that effectively summarizes the prompt with a max of six words. Then provide the strategy itself. When using complex terms, be sure to use simpler alternatives that a less educated student might understand (For example, HashMaps -> cache object) but you don't have to explain like you're talking to a 10 year old. KEEP THE RESPONSE LESS THAN 200 words. The response should not say anything like "Sure thing!" or "Of course!" or "I can help with that!". Just reply with "Here's a strategy to solve the problem:". Also provide the probability of each problem appearing in an interview setting in this format: "Interview Probability: low/medium/high". Put the probability in a separate line. Do not put the probability within the responseStrategy property.
          
          Response should be in the following format:
          
          Title: <title>
          
          <Strategy>
          
          <Interview Probability: <probability>>`,
        },
      ],
    });

    const response = aiResponse.data.choices[0].message.content.trim();
    console.log('raw response:', response);

    // Extract title
    const titleMatch = response.match(/Title:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract probability (low/medium/high)
    const probabilityMatch = response.match(
      /Interview Probability:\s*(low|medium|high)/i
    );
    const probability = probabilityMatch
      ? probabilityMatch[1].toLowerCase()
      : 'medium';

    // Extract strategy (remove title and probability lines)
    const strategy = response
      .replace(/Title:.*\n/, '')
      .replace(/Interview Probability:.*/, '')
      .trim();

    console.log('title:', title);
    console.log('strategy:', strategy);
    console.log('probability:', probability);

    res.json({
      title,
      prompt: userQuery,
      responseStrategy: strategy,
      probability,
      practiceProblems: [],
    });
  } catch (error) {
    console.error('Error in generateStrategy:', error);
    next(error);
  }
};

const generatePracticeProblems = async (req, res, next) => {
  try {
    const { userQuery } = req.body;

    const problemsResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      max_tokens: 700,
      messages: [
        {
          role: 'system',
          content:
            'Think of yourself as premium version of chatGPT, like a chatGPT Pro One Max. Your task is to generate 10 practice problems that utilize the same techniques and similar logic as the user inputted problem. You always give a thoughtful response in that the practice problem set will help the user build their understanding of the strategy utilized in their original problem. Just respond with the problems.',
        },
        {
          role: 'user',
          content: `Generate 10 practice problems that contain similar concepts as: ${userQuery}. Please make sure that the generated problems are NOT the same problem as the original user inputted problem, but utilize the same techniques and similar logic. Don't ever give the answer or any other kind of explanation like why it's similar to the original problem. I trust that the generated problems will be helpful for the user to practice and build their understanding of the strategy.
          
          Format the response as follows:
          Problem 1: <problem>
          
          Problem 2: <problem>
          
          ...`,
        },
      ],
    });

    console.log(
      'practice problems raw:',
      problemsResponse.data.choices[0].message.content
    );

    const problemsText =
      problemsResponse.data.choices[0].message.content.trim();
    const practiceProblems = problemsText
      .split('\n')
      .map((problem) => ({
        problem: problem.trim(),
        isCompleted: false,
      }))
      .filter((problem) => problem.problem.length > 0);

    res.locals.practiceProblems = practiceProblems;
    next();
  } catch (error) {
    console.error('Error in generatePracticeProblems:', error);
    next(error);
  }
};

export { generateStrategy, generatePracticeProblems };
