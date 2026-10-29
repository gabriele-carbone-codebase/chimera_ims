export interface AvatarProps {
  /** Full name — initials and colour derive from it. */
  name: string;
  src?: string;
  size?: number;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
export interface AvatarGroupProps { names: string[]; max?: number; size?: number; }
export declare function AvatarGroup(props: AvatarGroupProps): JSX.Element;
