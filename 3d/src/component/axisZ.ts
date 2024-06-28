import { DisplayObject } from "@antv/g-lite";
import { GuideComponentComponent as GCC, LinearAxis, AxisOptions } from "@antv/g2";

export function rotateAxis(axis: DisplayObject<any, any>, options: AxisOptions) {
  const { eulerAngles, origin } = options;
  if (origin) {
    axis.setOrigin(origin);
  }
  if (eulerAngles) {
    axis.rotate(eulerAngles[0], eulerAngles[1], eulerAngles[2]);
  }
}

export type AxisZOptions = AxisOptions;

/**
 * LinearAxis component bind to z scale.
 */
export const AxisZ: GCC<AxisZOptions> = (options) => {
  return (...args) => {
    const axisZ = LinearAxis(Object.assign({}, { crossPadding: 10 }, options))(...args);
    rotateAxis(axisZ, options);
    return axisZ;
  };
};

AxisZ.props = {
  ...LinearAxis.props,
  defaultPosition: "bottom",
  defaultPlane: "yz",
};

export function axisZConfig() {}
