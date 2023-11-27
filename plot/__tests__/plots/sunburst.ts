import { Runtime, extend, corelib } from "@antv/g2";
import { corelib as plotlib } from "../../src";

export function Sunburst(context) {
  const { container } = context;

  const Chart = extend(Runtime, { ...corelib(), ...plotlib() });
  const chart = new Chart({
    container,
  });

  chart
    .sunburst()
    .data({
      type: 'fetch',
      value: 'https://gw.alipayobjects.com/os/antfincdn/ryp44nvUYZ/coffee.json',
    })
    .animate('enter', { type: 'waveIn' })
    .coordinate({ type: 'polar', innerRadius: 0 });

  chart.render();

  return { destroy: () => chart.destroy() };
}
