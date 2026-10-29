export interface RadioOption { value: string; label: string; }
export interface RadioProps {
  options: Array<string | RadioOption>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  direction?: 'row' | 'column';
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;
