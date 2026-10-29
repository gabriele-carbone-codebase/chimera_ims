export interface ProgressProps {
  value: number;
  max?: number;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  label?: React.ReactNode;
  /** Show the percentage on the right (mono). */
  showValue?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Progress(props: ProgressProps): JSX.Element;
