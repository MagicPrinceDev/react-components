import { currencyFormat } from '@rolster/helpers-advanced';
import { RlsTheme } from '../../definitions';
import { RlsTabularText } from '../TabularText/TabularText';
import './Amount.css';

interface AmountProps {
  value: number;
  decimals?: boolean;
  rlsTheme?: RlsTheme;
  symbol?: string;
}

export function RlsAmount({ value, decimals, rlsTheme, symbol }: AmountProps) {
  return (
    <rls-amount className="rls-amount" rls-theme={rlsTheme}>
      {symbol && <span>{symbol}</span>}
      <RlsTabularText value={currencyFormat({ value, decimals })} />
    </rls-amount>
  );
}
