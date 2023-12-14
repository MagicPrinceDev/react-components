import './TabularText.css';

const baseCls = 'rls-tabular-text';
const pointers = ['.', ','];

function charClass(char: string): string {
  return pointers.includes(char) ? `${baseCls}__pointer` : `${baseCls}__char`;
}

interface TabularTextProps {
  value?: string;
}

export function RlsTabularText({ value }: TabularTextProps) {
  return (
    <div className="rls-tabular-text">
      {value?.split('').map((char, index) => (
        <span key={index} className={charClass(char)}>
          {char}
        </span>
      ))}
    </div>
  );
}
