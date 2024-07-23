import { ReactInputControl } from '@rolster/react-forms';
import { RlsButtonAction } from '../ButtonAction/ButtonAction';
import { RlsInput } from '../Input/Input';
import './InputSearch.css';

interface InputSearchProps {
  formControl?: ReactInputControl<string>;
  onSearch?: () => void;
  placeholder?: string;
}

export function RlsInputSearch({
  formControl,
  placeholder,
  onSearch
}: InputSearchProps) {
  return (
    <div className="rls-input-search">
      <RlsInput formControl={formControl} placeholder={placeholder} />
      {onSearch && <RlsButtonAction icon="search" onClick={onSearch} />}
    </div>
  );
}
