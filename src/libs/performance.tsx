import { Perf } from 'r3f-perf';

//TODO: Extract props
//TODO: causes an infinite log and no metrics shown
export function PerfDebug(props: any) {
  return <Perf {...props} />;
}
