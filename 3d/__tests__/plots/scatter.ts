import { CameraType } from "@antv/g";
import { DirectionalLight } from "@antv/g-plugin-3d";
import { Runtime, extend, corelib } from "@antv/g2";
import { threedlib } from "../../src";

export function Scatter(context) {
  const { container, renderer } = context;

  const Chart = extend(Runtime, { ...corelib(), ...threedlib() });
  const chart = new Chart({
    container,
    renderer,
    depth: 400,
  });

  chart
    .point3D()
    .data({
      type: "fetch",
      value: "data/cars2.csv",
    })
    .encode("x", "Horsepower")
    .encode("y", "Miles_per_Gallon")
    .encode("z", "Weight_in_lbs")
    .encode("size", "Origin")
    .encode("color", "Cylinders")
    .encode("shape", "cube")
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

    // Add a directional light into scene.
    const light = new DirectionalLight({
      style: {
        intensity: 2.5,
        fill: "white",
        direction: [-1, 0, 1],
      },
    });
    canvas!.appendChild(light);
  });

  return { finished, destroy: () => chart.destroy() };
}
