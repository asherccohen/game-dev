import { Stats, StatsGl } from '@react-three/drei';
import { Perf } from 'r3f-perf';

//TODO: Extract props

export type chart = {
  length: number;
  hz: number;
};
export type customData = {
  name: number;
  info: number;
  value: number;
  round: number;
};
export interface PerfProps {
  logsPerSecond?: number;
  overClock?: boolean;
  matrixUpdate?: boolean;
  customData?: customData;
  chart?: chart;
  deepAnalyze?: boolean;
}
export interface PerfPropsGui extends PerfProps {
  showGraph?: boolean;
  colorBlind?: boolean;
  antialias?: boolean;
  openByDefault?: boolean;
  position?: string;
  minimal?: boolean;
  className?: string;
  style?: object;
}
//TODO: causes an infinite log and no metrics shown
export function PerfDebug(props: PerfPropsGui) {
  return (
    <Perf position="top-right" minimal={false} showGraph={true} {...props} />
  );
}

//TODO: Extract props
//TODO: Deosn't render
type StatsGlDebugProps = {
  id?: string;
  clearStatsGlStyle?: boolean;
  // showPanel?: number;
  className?: string;
  // parent?: React.RefObject<HTMLElement>;
  // ref?: React.RefObject<HTMLElement>;
};

export function StatsGlDebug(props: StatsGlDebugProps) {
  return <StatsGl className="stats" {...props} />;
}

//TODO: Extract props
type StatsDebugProps = {
  showPanel?: number;
  className?: string;
  parent?: React.RefObject<HTMLElement>;
};
export function StatsDebug(props: StatsDebugProps) {
  return <Stats showPanel={0} className="stats" {...props} />;
}
