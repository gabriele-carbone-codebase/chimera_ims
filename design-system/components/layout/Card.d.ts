/**
 * @startingPoint section="Layout" subtitle="Content card with serif title, actions and footer" viewport="700x300"
 */
export interface CardProps {
  title?: React.ReactNode;
  /** Mono uppercase label above the title. */
  eyebrow?: string;
  /** Right-aligned header actions (IconButtons). */
  actions?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Inner padding in px. 20 default, 16 dense. */
  padding?: number;
  /** Hover lift + pointer cursor. */
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
