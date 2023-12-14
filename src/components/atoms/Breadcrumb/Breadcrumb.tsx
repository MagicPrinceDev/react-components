import './Breadcrumb.css';

interface BreadcrumbLabel {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  labels: BreadcrumbLabel[];
}

export function RlsBreadcrumb({ labels }: BreadcrumbProps) {
  return (
    <div className="rls-breadcrumb">
      {labels.map(({ label, onClick }, index) => (
        <label key={index} className="rls-breadcrumb__label" onClick={onClick}>
          <a className="rls-breadcrumb__label__a">{label}</a>
        </label>
      ))}
    </div>
  );
}
