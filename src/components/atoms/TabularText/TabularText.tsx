import './TabularText.css';

const baseCls = 'rls-tabular-text';
const pointers = ['.', ','];

function charClass(char: string): string {
  return pointers.includes(char) ? `${baseCls}__pointer` : `${baseCls}__char`;
}

interface TabularText {
  value?: string;
}

export function RlsTabularText({ value }: TabularText) {
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
