import { Coordinate3DComponent as CC } from '@antv/g2';
import { Cartesian3DCoordinate } from '@antv/g2';

export type Cartesian3DOptions = Cartesian3DCoordinate;

/**
 * Default coordinate3D transformation for all charts.
 */
export const Cartesian3D: CC<Cartesian3DCoordinate> = () => [['cartesian3D']];

Cartesian3D.props = {};
