import type { H3Event } from "h3";
import { getRouterParam as h3GetRouterParam } from "h3";

export function getRouterParam(
  event: H3Event,
  name: string
): string | undefined {
  return h3GetRouterParam(event, name);
}
