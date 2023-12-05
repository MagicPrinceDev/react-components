import { currencyFormat } from '@rolster/helpers-advanced';
import { RlsTheme } from '../../definitions';
import { RlsTabularText } from '../TabularText/TabularText';
import './Amount.css';

interface Amount {
  value: number;
  decimals?: boolean;
  rlsTheme?: RlsTheme;
  symbol?: string;
}

export function RlsAmount({ value, decimals, rlsTheme, symbol }: Amount) {
  return (
    <div className="rls-amount" rls-theme={rlsTheme}>
      {symbol && <span>{symbol}</span>}
      <RlsTabularText value={currencyFormat({ value, decimals })} />
    </div>
  );
}
