import { Auto } from "../../src";

export function AlphabetAutoBasic() {
  return {
    type: Auto,
    data: { type: "fetch", value: "data/alphabet.csv" },
    encode: {
      x: "letter",
      y: "frequency",
    },
  };
}
