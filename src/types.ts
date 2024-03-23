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
  | 'fromPosition'

export type ChallengeAI = {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  clockLimit?: number
  clockIncrement?: number
  days?: 1 | 2 | 3 | 5 | 7 | 10 | 14
  color?: 'white' | 'black' | 'random'
  variant?: GameVariant
  fen?: string
}
