import { lines } from '@antv/g-pattern';
import { Runtime, corelib, extend } from '@antv/g2';
import { plotlib } from '../../src';

export function SunburstPattern(context) {
  const { container } = context;
  const colors = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb'];
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
    .style({
      fill: (_, idx) => {
        return {
          image: lines({
            backgroundColor: colors[idx % colors.length],
            backgroundOpacity: 0.65,
            stroke: colors[idx % colors.length],
            lineWidth: 4,
            spacing: 5,
          }),
          repetition: 'repeat',
          transform: 'rotate(30deg)',
        };
      },
    });
  
  chart.render();

  return { destroy: () => chart.destroy() };
}
