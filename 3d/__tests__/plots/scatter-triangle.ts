import { CameraType } from "@antv/g";
import { DirectionalLight } from "@antv/g-plugin-3d";
import { Runtime, extend, corelib } from "@antv/g2";
import { threedlib } from "../../src";

export function ScatterTriangle(context) {
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
    .encode("shape", "triangle")
    .coordinate({ type: "cartesian3D" })
    .scale("x", { nice: true })
    .scale("y", { nice: true })
    .scale("z", { nice: true })
    .legend(false)
    .axis("x", { gridLineWidth: 2 })
    .axis("y", { gridLineWidth: 2, titleBillboardRotation: -Math.PI / 2 })
    .axis("z", { gridLineWidth: 2 })
    .style("fillOpacity", 0.8);

  const finished = chart.render().then(() => {
    const { canvas } = chart.getContext();
    const camera = canvas!.getCamera();
    camera.setPerspective(0.1, 5000, 45, 500 / 500);
    camera.setType(CameraType.ORBITING);

    // Add a directional light into scene.
    const light = new DirectionalLight({
      style: {
        intensity: 3,
        fill: "white",
        direction: [-1, 0, 1],
      },
    });
    canvas!.appendChild(light);
  });

  return { finished, destroy: () => chart.destroy() };
}
