import { currencyFormat } from '@rolster/helpers-advanced';
import { RlsTabularText } from '../TabularText/TabularText';
import './Amount.css';

interface Amount {
  value: number;
  decimals?: boolean;
  symbol?: string;
}

export function RlsAmount({ value, decimals, symbol }: Amount) {
  return (
    <div className="rls-amount">
      {symbol && <span>{symbol}</span>}
      <RlsTabularText value={currencyFormat({ value, decimals })} />
    </div>
  );
}
