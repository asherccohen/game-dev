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
  debug?: boolean;
}
//TODO: causes an infinite log and no metrics shown
export function PerfDebug({ debug = false, ...props }: PerfPropsGui) {
  if (!debug) {
    return null;
  }
  return (
    <Perf position="top-right" minimal={false} showGraph={true} {...props} />
  );
}

//TODO: Extract props
//TODO: Doesn't render
type StatsGlDebugProps = {
  id?: string;
  clearStatsGlStyle?: boolean;
  // showPanel?: number;
  className?: string;
  // parent?: React.RefObject<HTMLElement>;
  // ref?: React.RefObject<HTMLElement>;
  debug?: boolean;
};

export function StatsGlDebug({ debug = false, ...props }: StatsGlDebugProps) {
  if (!debug) {
    return null;
  }
  return <StatsGl className="stats" {...props} />;
}

//TODO: Extract props
type StatsDebugProps = {
  showPanel?: number;
  className?: string;
  parent?: React.RefObject<HTMLElement>;
  debug?: boolean;
};
export function StatsDebug({ debug = false, ...props }: StatsDebugProps) {
  if (!debug) {
    return null;
  }
  return <Stats showPanel={0} className="stats" {...props} />;
}
