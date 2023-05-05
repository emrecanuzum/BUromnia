import { ethers } from 'ethers';
import axios from 'axios';

const privateKey = '0xf28708801b7e46eb5ad4cd7edbb33e45fe973d639839df8ee2952e8d31332533';
const provider = ethers.getDefaultProvider('goerli');
const wallet = new ethers.Wallet(privateKey, provider);

interface AuthMessage {
  statement: string;
  chainId: number;
  nonce: string;
  issuedAt: number;
  expirationTime: number;
  requestId: string;
}

interface AuthResponse {
  message: string;
  signature: string;
}

export async function getMessage(): Promise<AuthMessage> {
  try {
    const response = await axios.get<AuthMessage>('https://app.omniatech.io/api/v1/auth?chainId=1', { withCredentials: true });
    return response.data;
  } catch (error) {
    // console.error(error);
    throw new Error('Failed to fetch auth message.');
  }
}

async function signMessage(message: AuthMessage): Promise<AuthResponse> {
  let omniamassage = `app.omniatech.io wants you to sign in with your Ethereum account:\n${wallet.address}\n\n${message.statement}\n\nURI: https://endpoints.omniatech.io/auth\nVersion: 1\nChain ID: ${message.chainId}\nNonce: ${message.nonce}\nIssued At: ${message.issuedAt}\nExpiration Time: ${message.expirationTime}\nRequest ID: ${message.requestId}`;
  const signature = await wallet.signMessage(omniamassage);
  let return_object = {
    "message": omniamassage,
    "signature": signature,
  };
  return return_object;
}

export async function authPostRequest(): Promise<string> {
  const url = 'https://app.omniatech.io/api/v1/auth';
  const message = await getMessage();
  const data = await signMessage(message);
  try {
    const response = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
    const tokenlist = response.headers['set-cookie'];
    const tokenHeader = tokenlist.find((header: string) => header.includes('token='));
    if (tokenHeader) {
      const token = tokenHeader.split('token=')[1].split(';')[0];
      return token;
    } else {
      throw new Error('Failed to extract token from response headers.');
    }
  } catch (error) {
    // console.log(error);
    throw new Error('Failed to authenticate.');
  }
}

export async function ethGoerli() {
  const url = 'https://app.omniatech.io/api/v1/endpoints';
  let coockie_token = await authPostRequest();
  const body = {"chain":"ETH","networkId":5,"subscriptionDays":365,"dailyRequests":100000,"rpsQuota":25,"useFlashbots":false};  
let headers = `token=${coockie_token}`

  // console.log(body);
  try {
    const response = await axios.post(url, body,{
      headers: {
        'Content-Type': 'application/json',
        'Cookie': headers
      }
    });
    
    return response.data;
    console.log('success');
  } catch (error) {
    // console.log(error);
    // console.log('something went wrong');
  }
}


/*
export async function solDev() {
  const url = 'https://app.omniatech.io/api/v1/endpoints';
  let coockie_token = await authPostRequest();
  const body = {
    "chain": "SOL",
    "networkId": -2,
    "subscriptionDays": 365,
    "dailyRequests": 100000,
    "rpsQuota": 25,
    "useFlashbots": false
  };
  let headers = `token=${coockie_token}`;
        try {
    const response = await axios.post(url, body, {
    headers: {
    'Content-Type': 'application/json',
    'Cookie': headers
    },
    withCredentials: true
    });
    console.log('success');
    return response.data;
    } catch (error) {
    console.log(error);
    console.log('something went wrong');
    }
    }
*/
    



