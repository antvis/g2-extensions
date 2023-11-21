import { CameraType } from "@antv/g";
import { Runtime, extend, corelib } from "@antv/g2";
import { threedlib } from "../../src";

export function Line(context) {
  const { container, renderer } = context;

  const Chart = extend(Runtime, { ...corelib(), ...threedlib() });
  const chart = new Chart({
    container,
    renderer,
    depth: 400,
  });

  /**
   * 3D Line
   * @see https://plotly.com/javascript/3d-line-plots/
   */
  const pointCount = 31;
  let r: number;
  const data: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < pointCount; i++) {
    r = 10 * Math.cos(i / 10);
    data.push({
      x: r * Math.cos(i),
      y: r * Math.sin(i),
      z: i,
    });
  }

  chart
    .line3D()
    .data(data)
    .encode("x", "x")
    .encode("y", "y")
    .encode("z", "z")
    .encode("size", 4)
    .coordinate({ type: "cartesian3D" })
    .scale("x", { nice: true })
    .scale("y", { nice: true })
    .scale("z", { nice: true })
    .legend(false)
    .axis("x", { gridLineWidth: 2 })
    .axis("y", { gridLineWidth: 2, titleBillboardRotation: -Math.PI / 2 })
    .axis("z", { gridLineWidth: 2 });

  const finished = chart.render().then(() => {
    const { canvas } = chart.getContext();
    const camera = canvas!.getCamera();
    camera.setType(CameraType.ORBITING);
    camera.rotate(-20, -20, 0);
  });

  return { finished, destroy: () => chart.destroy() };
}
