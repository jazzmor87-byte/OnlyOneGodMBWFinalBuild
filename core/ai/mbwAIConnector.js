import { readMBWGraph, recordMBWGraphEvent } from "../graph/mbwGraphStore";

function scoreName(value = "") {
  return String(value).split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

export function predictNextScreen(currentRoute, availableRoutes = []) {
  const routes = Array.isArray(availableRoutes) ? availableRoutes.filter(Boolean) : [];
  if (routes.length === 0) return null;
  const seed = scoreName(currentRoute || "MBW");
  return routes[seed % routes.length];
}

export function suggestRouteFix(routeName, registry = {}) {
  const graph = readMBWGraph();
  const known = registry && typeof registry === "object" ? Object.keys(registry) : [];
  const routeKnown = Boolean(routeName && (registry[routeName] || graph.routes[routeName]));
  const result = { routeName, routeKnown, knownRouteCount: known.length || Object.keys(graph.routes).length, action: routeKnown ? "KEEP_ROUTE" : "CHECK_ROUTE_REGISTRY" };
  recordMBWGraphEvent("AI_ROUTE_FIX_SUGGESTION", result);
  return result;
}

export function optimizeFlow(routeList = []) {
  const clean = Array.from(new Set((Array.isArray(routeList) ? routeList : []).filter(Boolean)));
  const result = { routeCount: clean.length, entry: clean[0] || null, exit: clean[clean.length - 1] || null, clean };
  recordMBWGraphEvent("AI_FLOW_OPTIMIZED", result);
  return result;
}

export function detectNavigationRisk(routeName, handlers = {}) {
  const hasHandler = Boolean(routeName && handlers && handlers[routeName]);
  const result = { routeName, riskLevel: hasHandler ? "LOW" : "REVIEW", hasHandler };
  recordMBWGraphEvent("AI_NAV_RISK", result);
  return result;
}

export const mbwAIConnector = { predictNextScreen, suggestRouteFix, optimizeFlow, detectNavigationRisk };
export default mbwAIConnector;
