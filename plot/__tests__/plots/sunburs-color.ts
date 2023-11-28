import { Runtime, extend, corelib } from "@antv/g2";
import { plotlib } from "../../src";

export function SunburstColor(context) {
  const { container } = context;

  const Chart = extend(Runtime, { ...corelib(), ...plotlib() });
  const chart = new Chart({
    container,
  });

  chart
  .sunburst()
  .data({
    type: 'fetch',
    value: 'https://gw.alipayobjects.com/os/antvdemo/assets/data/sunburst.json',
  })
  .encode('value', 'sum')
  .encode('color', 'label');

  chart.render();

  return { destroy: () => chart.destroy() };
}
