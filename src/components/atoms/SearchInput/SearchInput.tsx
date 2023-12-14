import { ReactInputControl } from '@rolster/react-forms';
import { RlsButtonAction } from '../ButtonAction/ButtonAction';
import { RlsInput } from '../Input/Input';
import './SearchInput.css';

interface SearchInputProps {
  formControl?: ReactInputControl<string>;
  placeholder?: string;
  onSearch?: () => void;
}

export function RlsSearchInput({
  formControl,
  placeholder,
  onSearch
}: SearchInputProps) {
  return (
    <div className="rls-search-input">
      <RlsInput formControl={formControl} placeholder={placeholder} />
      {onSearch && <RlsButtonAction icon="search" onClick={onSearch} />}
    </div>
  );
}
