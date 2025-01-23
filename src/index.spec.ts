import dotenv from 'dotenv';
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

import { analyzeTweet } from './services/sentimentAnalyzer';
import { fetchTweet, getTweetId } from './services/twitterService';

describe('Tweet Sentiment Analysis', () => {
  // Adding timeout since we're making real requests
  jest.setTimeout(30000);
  const context = "The post is about $FLUID, the 0xFluid token."

  it('should identify positive sentiment correctly', async () => {
    const tweet = await fetchTweet(getTweetId('https://x.com/litocoen/status/1864065160471851288'));
    const result = await analyzeTweet(tweet, context);
    console.log('Positive test result:', result);
    expect(result).toBe('positive');
  });

  it('should identify negative sentiment correctly', async () => {
    const tweet = await fetchTweet(getTweetId('https://x.com/nonstopTheo/status/1874155274308829631'));
    const result = await analyzeTweet(tweet, context);
    console.log('Negative test result:', result);
    expect(result).toBe('negative');
  });

  it('should identify unclear sentiment correctly', async () => {
    const tweet = await fetchTweet(getTweetId('https://x.com/0xfluid/status/1864009746988372448'));
    const result = await analyzeTweet(tweet, context);
    console.log('Unclear test result:', result);
    expect(result).toBe('unclear');
  });

  it('should identify non-pertinent content correctly', async () => {
    const tweet = await fetchTweet(getTweetId('https://x.com/PageOf_History/status/1874444656907567246'));
    const result = await analyzeTweet(tweet, context);
    console.log('Not pertinent test result:', result);
    // The sentiment should be 'unclear' when the content is not pertinent
    expect(result).toBe('unclear');
  });

  it('should throw error for invalid URL', async () => {
    await expect(analyzeTweet({ text: 'Invalid tweet', author: null }, context)).rejects.toThrow('Invalid Twitter URL');
  });
}); 