import { AxiosResponse } from 'axios';
import { getGoodGetter } from './getter';
import { Readable } from 'stream';

export type GameVariant =
  | 'standard'
  | 'chess960'
  | 'crazyhouse'
  | 'antichess'
  | 'atomic'
  | 'horde'
  | 'kingOfTheHill'
  | 'racingKings'
  | 'threeCheck'
  | 'fromPosition';

export type ChallengeAI = {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  clockLimit?: number;
  clockIncrement?: number;
  days?: 1 | 2 | 3 | 5 | 7 | 10 | 14;
  color?: 'white' | 'black' | 'random';
  variant?: GameVariant;
  fen?: string;
};

export type StreamData =
  | AxiosResponse<unknown, unknown>
  | { parser: Readable; endStream: () => void };

export class EquineButBetterCuzICanActuallyProgFuckIHateEveryThing {
  private token: string;
  private endStreamGame: StreamData | undefined;
  private endStreamEvent: StreamData | undefined;

  constructor(token: string) {
    this.token = token;
    this.board = {
      gameStream: this.gameStream.bind(this),
      endGameStream: this.endGameStream.bind(this),
      moveFigure: this.moveFigure.bind(this),
      eventStream: this.eventStream.bind(this),
      endEventStream: this.endEventStream.bind(this),
    };
    this.challenge = {
      ai: this.ai.bind(this),
    };
  }

  public setToken(token: string) {
    this.token = token;
  }

  public challenge: {
    ai: ({
      level,
      clockLimit,
      clockIncrement,
      days,
      color,
      variant,
      fen,
    }: ChallengeAI) => Promise<{ data: JSON }>;
  };

  private async ai({
    level,
    clockLimit,
    clockIncrement,
    days,
    color,
    variant,
    fen,
  }: ChallengeAI) {
    const endpoint = `/challenge/ai`;

    const body = new URLSearchParams();
    if (level) body.append('level', level.toString());
    if (clockLimit) body.append('clock.limit', clockLimit.toString());
    if (clockIncrement)
      body.append('clock.increment', clockIncrement.toString());
    if (days) body.append('days', days.toString());
    if (color) body.append('color', color);
    if (variant) body.append('variant', variant);
    if (fen) body.append('fen', fen);

    const response = await getGoodGetter({
      endpoint: endpoint,
      body: body,
      token: this.token,
      method: 'POST',
      responseType: 'json',
    });

    if (response && 'data' in response) {
      return { data: response.data as JSON };
    } else {
      throw new Error('Invalid response format');
    }
  }

  public board: {
    gameStream: (
      gameId: string,
      onData?: (data: JSON) => void,
    ) => Promise<unknown>;
    endGameStream: () => Promise<void>;
    moveFigure: (gameId: string, move: string) => Promise<{ data: JSON }>;
    eventStream: (onData?: (data: JSON) => void) => Promise<unknown>;
    endEventStream: () => Promise<void>;
  };

  private async moveFigure(gameId: string, move: string) {
    const endpoint = `/board/game/${gameId}/move/${move}`;
    const response = await getGoodGetter({
      endpoint,
      token: this.token,
      method: 'POST',
      responseType: 'json',
    });

    if (response && 'data' in response) {
      return { data: response.data as JSON };
    } else {
      throw new Error('Invalid response format');
    }
  }

  private async gameStream(gameId: string, onData?: (data: JSON) => void) {
    this.endStreamGame = (await getGoodGetter({
      endpoint: `/stream/game/${gameId}`,
      responseType: 'stream',
      token: this.token,
      onData,
    })) as StreamData;
    return this.endStreamGame;
  }

  private async endGameStream() {
    console.log(this.endStreamGame);
    if (
      this.endStreamGame &&
      typeof this.endStreamGame === 'object' &&
      'endStream' in this.endStreamGame
    ) {
      this.endStreamGame.endStream();
    }
  }

  private async eventStream(onData?: (data: JSON) => void) {
    this.endStreamEvent = (await getGoodGetter({
      endpoint: `/stream/event`,
      responseType: 'stream',
      token: this.token,
      onData,
    })) as StreamData;
    return this.endStreamEvent;
  }

  private async endEventStream() {
    console.log(this.endStreamEvent);
    if (
      this.endStreamEvent &&
      typeof this.endStreamEvent === 'object' &&
      'endStream' in this.endStreamEvent
    ) {
      this.endStreamEvent.endStream();
    }
  }
}
