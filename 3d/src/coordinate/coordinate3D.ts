import { Transformation3D } from "@antv/coord";
import { G2BaseComponent, BaseCoordinate } from "@antv/g2";

export type Cartesian3DCoordinate = BaseCoordinate<{
  type?: "cartesian3D";
}>;

export type Coordinate3DTransform = Transformation3D[];
export type Coordinate3DProps = {
  transform?: boolean;
};
export type Coordinate3DComponent<O = Record<string, unknown>> = G2BaseComponent<
  Coordinate3DTransform,
  O,
  Coordinate3DProps
>;

export type Cartesian3DOptions = Cartesian3DCoordinate;

/**
 * Default coordinate3D transformation for all charts.
 */
export const Cartesian3D: Coordinate3DComponent<Cartesian3DCoordinate> = () => [["cartesian3D"]];

Cartesian3D.props = {};
