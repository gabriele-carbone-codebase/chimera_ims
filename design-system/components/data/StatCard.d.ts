/**
 * @startingPoint section="Data" subtitle="KPI tile with value, delta and caption" viewport="700x180"
 */
export interface StatCardProps {
  /** Short mono overline label. */
  label: string;
  value: React.ReactNode;
  unit?: string;
  /** e.g. "+12%" */
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  caption?: string;
  /** Lucide icon in the top-right. */
  icon?: string;
  style?: React.CSSProperties;
}
export declare function StatCard(props: StatCardProps): JSX.Element;
