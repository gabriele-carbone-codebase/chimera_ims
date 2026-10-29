export interface TagProps {
  children?: React.ReactNode;
  /** Optional category swatch (e.g. a --stage-* token). */
  color?: string;
  selected?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
