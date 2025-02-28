import { plotlib } from "../../src";
import { DrillDown } from '../../src/interaction/drillDown';
import { Sunburst } from '../../src/mark/sunburst';

describe("plotlib", () => {
  it("plotlib should export expected marks", () => {
    expect(plotlib()).toEqual({
      "interaction.drillDown": DrillDown,
      "mark.sunburst": Sunburst,
    });
  });
});
