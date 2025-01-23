import { Rettiwt } from 'rettiwt-api';

export type TweetResult = {
  text: string;
  author: any;
};

export const getTweetId = (url: string): string => {
  const matches = url.match(/status\/(\d+)/);
  if (!matches) throw new Error('Invalid Twitter URL');
  return matches[1];
};


export async function fetchTweet(tweetId: string): Promise<TweetResult> {
    try {
      const rettiwt = new Rettiwt();
      
      const tweet = await rettiwt.tweet.details(tweetId);
      if(!tweet) throw new Error('Rettiwt failed, maybe tweet does not exist');
      const {fullText } = tweet;
      if (!fullText) {
        throw new Error('Tweet not found or empty');
      }
      console.log(tweet);
  
      return {
        author: tweet.tweetBy.userName,
        text: fullText
      };
    } catch (error) {
      console.error('Error analyzing tweet:', error);
      throw error;
    }
  } 