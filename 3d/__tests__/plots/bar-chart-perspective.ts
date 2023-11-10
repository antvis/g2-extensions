import { register } from "@antv/g2";
import { Auto } from "../../src";

register("mark.auto", Auto);

export function AlphabetAutoBasic() {
  return {
    type: "auto",
    data: { type: "fetch", value: "data/alphabet.csv" },
    animate: {
      enter: { type: "waveIn" },
    },
  };
}
