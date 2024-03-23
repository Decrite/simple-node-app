import axios, { AxiosResponse } from 'axios';
import ndjson from 'ndjson';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

export type GetterProps = {
  endpoint: string;
  token: string;
  method?: 'GET' | 'POST';
  body?: URLSearchParams;
  params?: URLSearchParams;
  responseType?:
    | 'stream'
    | 'json'
    | 'text'
    | 'arraybuffer'
    | 'blob'
    | undefined;
  onData?: (data: JSON) => void;
};

export const getGoodGetter = async ({
  endpoint,
  token,
  method = 'GET',
  params,
  body,
  responseType = 'stream',
  onData = (data: unknown) => console.log('Received message:', data),
}: GetterProps): Promise<
  | { parser: Readable; endStream: () => void }
  | AxiosResponse<unknown>
  | undefined
> => {
  const config = {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType,
  };
  console.log(config);
  try {
    const response = axios({
      method: method,
      url: `${process.env.LICHESS_API_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: body,
      params: params,
      responseType: responseType,
    });

    if (responseType === 'stream') {
      const parser = (await response).data.pipe(ndjson.parse());
      parser.on('data', (data: JSON) => onData(data));
      parser.on('end', () => {
        console.log('Stream ended');
      });

      const endStream = () => {
        parser.destroy();
        console.log('Stream ended by user.');
      };

      return { parser, endStream };
    }
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response; // Return the Axios response error
    } else {
      throw error; // Rethrow other types of errors
    }
  }
};
