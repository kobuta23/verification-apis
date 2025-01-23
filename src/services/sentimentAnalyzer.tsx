import { Rettiwt } from 'rettiwt-api';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { TweetResult } from './twitterService';

// Load environment variables from .env file
dotenv.config();

// Types
type SentimentResult = {
  text: string;
  sentiment: 'positive' | 'negative' | 'unclear' | 'irrelevant';
  author: any;
};

// Extract tweet ID from URL
export const getTweetId = (url: string): string => {
  // check if the url is a url or an id. output an id either way
  const matches = url.match(/status\/(\d+)/);
  if (!matches) throw new Error('Invalid Twitter URL');
  return matches[1];
};

const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI with a simple prompt
const openai = new OpenAI({
  apiKey: OPENAI_KEY,
});

export const analyzeTweet = async (tweet: TweetResult, context:string): Promise<'positive' | 'negative' | 'unclear' | 'irrelevant'> => {
  const { text, author } = tweet;
  console.log(OPENAI_KEY);
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are analyzing text sentiment with strict criteria. However, sometimes we are not sure if the text is related to the context. 
        When in doubt, mark as "unclear".
        Follow these steps:

        1. First, check if the text is CLEARLY related to the provided context. 
        The provided context is: "${context}"
        To check relevance, follow these steps:
        - Check if any of the keywords or phrases from the context are present in the text.
        - If there are no keywords or phrases from the context present in the text, respond immediately with "irrelevant"
        - If the tweet is clearly about a different topic, respond immediately with "irrelevant"
        - If there are keywords or phrases from the context present in the text, continue with sentiment analysis.

2. For sentiment analysis:
   - Reply "positive" ONLY if the text expresses clear, unambiguous positive sentiment
   - Reply "negative" ONLY if the text expresses clear, unambiguous negative sentiment
   - Reply "unclear" for ANY of these cases:
     * Mixed sentiments
     * Neutral statements
     * Factual statements (the text does not express any opinion)
     * Ambiguous meaning
     * Sarcasm or irony
     * Any doubt about the true sentiment
     * However, if you are sure that the text is not related to the context, reply "irrelevant"
     * Unclear sentiment from words like "yet", "not even", "not yet", "not even yet", etc.

Respond with one word: "positive", "negative", "unclear", or "irrelevant".
`
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0,
    max_tokens: 10
  });

  const sentiment = response.choices[0].message.content?.toLowerCase().trim();
  console.log(response.choices[0].message);
  
  if (sentiment === 'positive' || sentiment === 'negative' || sentiment === 'unclear' || sentiment == 'irrelevant') {
    return sentiment;
  }
  return 'unclear';
};