import dotenv from 'dotenv';
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

import { analyzeTweet } from './services/sentimentAnalyzer';

describe('Tweet Sentiment Analysis', () => {
  // Adding timeout since we're making real requests
  jest.setTimeout(30000);
  const context = "The post is about $FLUID, the 0xFluid token."

  it('should identify positive sentiment correctly', async () => {
    const result = await analyzeTweet('https://x.com/litocoen/status/1864065160471851288', context);
    console.log('Positive test result:', result);
    expect(result.sentiment).toBe('positive');
  });

  it('should identify negative sentiment correctly', async () => {
    const result = await analyzeTweet('https://x.com/nonstopTheo/status/1874155274308829631', context);
    console.log('Negative test result:', result);
    expect(result.sentiment).toBe('negative');
  });

  it('should identify unclear sentiment correctly', async () => {
    const result = await analyzeTweet('https://x.com/0xfluid/status/1864009746988372448', context);
    console.log('Unclear test result:', result);
    expect(result.sentiment).toBe('unclear');
  });

  it('should identify non-pertinent content correctly', async () => {
    const result = await analyzeTweet('https://x.com/PageOf_History/status/1874444656907567246', context);
    console.log('Not pertinent test result:', result);
    // The sentiment should be 'unclear' when the content is not pertinent
    expect(result.sentiment).toBe('unclear');
  });

  it('should throw error for invalid URL', async () => {
    await expect(analyzeTweet('https://x.com/invalid', context)).rejects.toThrow('Invalid Twitter URL');
  });
}); 