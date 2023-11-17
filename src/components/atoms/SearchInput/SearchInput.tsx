import { ReactInputControl } from '../../../hooks';
import { RlsButtonAction } from '../ButtonAction/ButtonAction';
import { RlsInput } from '../Input/Input';
import './SearchInput.css';

interface SearchInput {
  formControl?: ReactInputControl<string>;
  placeholder?: string;
  onSearch?: () => void;
}

export function RlsSearchInput({
  formControl,
  placeholder,
  onSearch
}: SearchInput) {
  return (
    <div className="rls-search-input">
      <RlsInput formControl={formControl} placeholder={placeholder} />
      {onSearch && <RlsButtonAction icon="search" onClick={onSearch} />}
    </div>
  );
}
