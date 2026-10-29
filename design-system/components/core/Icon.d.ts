export interface IconProps {
  /** Lucide icon name, kebab-case (e.g. "lightbulb", "chart-line"). */
  name: string;
  /** Pixel size. 16 in dense UI, 20 in nav, 24 on mobile. */
  size?: number;
  /** Any CSS color; defaults to currentColor. */
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
