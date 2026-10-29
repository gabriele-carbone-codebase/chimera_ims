export interface TabItem { value: string; label: string; count?: number; }
export interface TabsProps {
  tabs: Array<string | TabItem>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** underline = page sections; segmented = compact view switch. */
  variant?: 'underline' | 'segmented';
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
