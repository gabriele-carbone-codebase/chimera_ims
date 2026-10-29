export interface InputProps {
  label?: string;
  hint?: string;
  /** Error message; turns the border red and replaces hint. */
  error?: string;
  /** Leading Lucide icon (e.g. "search"). */
  icon?: string;
  disabled?: boolean;
  /** Render a textarea. */
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
