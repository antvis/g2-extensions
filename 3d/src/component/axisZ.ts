import { GuideComponentComponent as GCC, LinearAxis, AxisOptions, rotateAxis } from "@antv/g2";

export type AxisXOptions = AxisOptions;

/**
 * LinearAxis component bind to z scale.
 */
export const AxisZ: GCC<AxisXOptions> = (options) => {
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
