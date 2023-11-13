import { MaybeKey, MaybeTitle, MaybeTooltip, Channel } from "@antv/g2";

export type ChannelOptions = {
  shapes?: (string | { (...args: any[]); props?: Record<string, any> })[];
};

export function baseChannels(options: ChannelOptions = {}): Channel[] {
  const { shapes } = options;
  return [
    { name: "color" },
    { name: "opacity" },
    { name: "shape", range: shapes },
    { name: "enterType" },
    { name: "enterDelay", scaleKey: "enter" },
    { name: "enterDuration", scaleKey: "enter" },
    { name: "enterEasing" },
    { name: "key", scale: "identity" },
    { name: "groupKey", scale: "identity" },
    { name: "label", scale: "identity" },
  ];
}

export function baseGeometryChannels(options: ChannelOptions = {}): Channel[] {
  return [...baseChannels(options), { name: "title", scale: "identity" }];
}

export function tooltip3d() {
  return [
    { type: MaybeTitle, channel: "color" },
    { type: MaybeTooltip, channel: ["x", "y", "z"] },
  ];
}

export function basePreInference() {
  return [{ type: MaybeKey }];
}

export function basePostInference() {
  return [];
}
