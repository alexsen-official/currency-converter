import { Code } from './code.enum';

export interface Exchange {
  base: string;
  rates: { [key in Code]?: number };
}
