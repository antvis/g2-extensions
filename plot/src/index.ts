import { runtime } from '@antv/g';
import { Sunburst } from "./mark/sunburst";
import { DrillDown } from "./interaction/drillDown";

runtime.enableCSSParsing = false;

export function corelib() {
  return {
    "interaction.drillDown": DrillDown,
    "mark.sunburst": Sunburst,
  } as const;
}
