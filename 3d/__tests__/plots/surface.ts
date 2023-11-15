import { CameraType } from "@antv/g";
import { Renderer as WebGLRenderer } from "@antv/g-webgl";
import { Plugin as ThreeDPlugin } from "@antv/g-plugin-3d";
import { Plugin as ControlPlugin } from "@antv/g-plugin-control";
import { Runtime, extend, corelib } from "@antv/g2";
import { threedlib } from "../../src";
import diric from "dirichlet";

const size = 100;
const points: { x: number; y: number; z: number }[] = [];
for (let i = 0; i < size + 1; i++) {
  for (let j = 0; j < size + 1; j++) {
    points.push({
      x: i,
      y: j,
      z: 0.1 * size * diric(5, (5.0 * (i - size / 2)) / size) * diric(5, (5.0 * (j - size / 2)) / size),
    });
  }
}

export function Surface(context) {
  const { container } = context;

  // Create a WebGL renderer.
  const renderer = new WebGLRenderer();
  renderer.registerPlugin(new ThreeDPlugin());
  renderer.registerPlugin(new ControlPlugin());

  const Chart = extend(Runtime, { ...corelib(), ...threedlib() });
  const chart = new Chart({
    container,
    renderer,
    width: 500,
    height: 500,
    depth: 300,
  });

  chart
    .surface3D()
    .data(points)
    .encode("x", "x")
    .encode("y", "y")
    .encode("z", "z")
    .encode("color", "z")
    .coordinate({ type: "cartesian3D" })
    .scale("x", { nice: true })
    .scale("y", { nice: true })
    .scale("z", { nice: true })
    .scale("color", { palette: "spectral" })
    .legend(false)
    .axis("x", { gridLineWidth: 1 })
    .axis("y", { gridLineWidth: 1, titleBillboardRotation: -Math.PI / 2 })
    .axis("z", { gridLineWidth: 1 });

  const finished = chart.render().then(() => {
    const { canvas } = chart.getContext();
    const camera = canvas!.getCamera();
    camera.setType(CameraType.ORBITING);
    camera.rotate(-20, -20, 0);
  });

  return { finished, destroy: () => chart.destroy() };
}
