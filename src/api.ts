import 'dotenv/config'; // Add this at the top
import express from 'express';
import { analyzeTweet } from './services/sentimentAnalyzer';
import { getTweetId, fetchTweet } from './services/twitterService';
import { getPublicClient } from './getPublicClient';
import { getSubgraphEndpoint } from './chainConfig';
import { chains } from './chainConfig';
import axios from 'axios';
const app = express();
app.use(express.json());

/*app.post('/analyze-sentiment', async (req: any, res: any) => {
  try {
    const { url, context } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    if(!context) {
      return res.status(400).json({ error: 'context is required'});
    }
    const tweetId = getTweetId(url);
    const tweet = await fetchTweet(tweetId);
    const result = await analyzeTweet(tweet, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});*/


app.post('/fetch-tweet', async (req: any, res: any) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const tweetId = getTweetId(url);
    const result = await fetchTweet(tweetId);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/check-sender-streams', async(req: any, res: any) => {
  console.log("Checking sender streams");
  console.log(req.body);
  try {
    const { chainString, sender } = req.body;
    console.log(chainString, sender);
    // Check if chainString exists
    if (!chainString) {
      return res.status(400).json({ error: 'Chain is required' });
    }
    // Process chainString
    const chainIdMatch = chainString.match(/\((\d+)\)/);
    if (!chainIdMatch) {
      return res.status(400).json({ error: 'Invalid chain format. Expected format: "Chain Name (chainId)"' });
    }    
    const chainId = parseInt(chainIdMatch[1]);
    if (!chains[chainId]) {
      return res.status(400).json({ error: `Chain ID ${chainId} not supported` });
    }
    // Check if sender exists and is valid
    if (!sender) {
      return res.status(400).json({ error: 'Sender is required' });
    }
    if (!sender.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid sender address format' });
    }
    const subgraphEndpoint = getSubgraphEndpoint(chainId) || '';

    const query = `
      query MyQuery {
        streams(
          where: {currentFlowRate_gt: "0", sender: "${sender.toLowerCase()}"}
        ) {
          currentFlowRate
          receiver {
            id
          }
          token {
            symbol
          }
        }
      }`;
    const response = await fetch(subgraphEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json());
    console.log(response.data);
    let p = "Streaming: \n";
    response.data.data.streams.forEach((stream: any) => {
      p+=
      ` ${(Number(stream.currentFlowRate) * 86400/1e18).toFixed(4).toString()} ${stream.token.symbol} per day to ${stream.receiver.id}\n`
    });
    res.json(p);
    console.log(p);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
});

// test get endpoint
app.get('/test', async (req: any, res: any) => {
  res.json({ message: 'Hello, world!' });
});


const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 