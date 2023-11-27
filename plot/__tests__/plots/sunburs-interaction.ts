import { Runtime, extend, corelib } from "@antv/g2";
import { corelib as plotlib } from "../../src";

export function SunburstInteraction(context) {
  const { container } = context;

  const Chart = extend(Runtime, { ...corelib(), ...plotlib() });
  const chart = new Chart({
    container,
  });

  const interaction = {
    drillDown: {
      breadCrumb: {
        rootText: '起始',
        style: {
          fontSize: '18px',
          fill: '#333',
        },
        active: {
          fill: 'red',
        },
      },
      // FixedColor default: true, true -> drillDown update scale, false -> scale keep.
      fixedColor: false,
    },
  };

  chart
    .sunburst()
    .data({
      type: 'fetch',
      value: 'https://gw.alipayobjects.com/os/antvdemo/assets/data/sunburst.json',
    })
    .encode('value', 'sum')
    .label({
      text: 'name',
      transform: [
        {
          // 超出形状隐藏
          type: 'overflowHide',
        },
      ],
    })
    // @ts-ignore
    .interaction(interaction)
    .state({
      active: { zIndex: 2, stroke: 'red' },
      inactive: { zIndex: 1, stroke: '#fff' },
    });

  chart.render();

  return { destroy: () => chart.destroy() };
}
