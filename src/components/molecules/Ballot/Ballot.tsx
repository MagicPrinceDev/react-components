import { renderClassStatus } from '../../../helpers/css';
import { RlsAvatar, RlsSkeletonText } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './Ballot.css';

interface BallotProps extends RlsComponent {
  bordered?: boolean;
  img?: string;
  initials?: string;
  skeleton?: boolean;
  subtitle?: string;
}

export function RlsBallot({
  bordered,
  children,
  img,
  initials,
  skeleton,
  subtitle,
  rlsTheme
}: BallotProps) {
  return (
    <div
      className={renderClassStatus('rls-ballot', { bordered, skeleton })}
      rls-theme={rlsTheme}
    >
      {(img || initials) && (
        <RlsAvatar skeleton={skeleton}>
          {img && <img src={img} />}
          {initials && <span>{initials}</span>}
        </RlsAvatar>
      )}
      <div className="rls-ballot__component">
        <label className="rls-ballot__title">
          <RlsSkeletonText active={skeleton}>{children}</RlsSkeletonText>
        </label>
        {subtitle && (
          <label className="rls-ballot__subtitle">
            <RlsSkeletonText active={skeleton}>{subtitle}</RlsSkeletonText>
          </label>
        )}
      </div>
    </div>
  );
}
