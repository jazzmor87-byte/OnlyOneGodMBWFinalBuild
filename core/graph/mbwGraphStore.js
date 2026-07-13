const MBW_GRAPH_STORE = {
  version: "fresh-runtime-os-v2",
  brand: "MEN BEHIND WALL",
  colors: ["black", "gold", "maroon"],
  screens: {},
  routes: {},
  edges: [],
  events: [],
};

const stamp = () => new Date().toISOString();

export function registerMBWScreen(name, meta = {}) {
  if (!name) return MBW_GRAPH_STORE;
  MBW_GRAPH_STORE.screens[name] = { name, meta, updatedAt: stamp() };
  return MBW_GRAPH_STORE;
}

export function registerMBWRoute(name, target, meta = {}) {
  if (!name) return MBW_GRAPH_STORE;
  MBW_GRAPH_STORE.routes[name] = { name, target: target || name, meta, updatedAt: stamp() };
  return MBW_GRAPH_STORE;
}

export function registerMBWEdge(from, to, meta = {}) {
  if (!from || !to) return MBW_GRAPH_STORE;
  MBW_GRAPH_STORE.edges.push({ from, to, meta, updatedAt: stamp() });
  return MBW_GRAPH_STORE;
}

export function recordMBWGraphEvent(type, payload = {}) {
  MBW_GRAPH_STORE.events.push({ type: type || "UNKNOWN", payload, at: stamp() });
  if (MBW_GRAPH_STORE.events.length > 111) MBW_GRAPH_STORE.events.shift();
  return MBW_GRAPH_STORE;
}

export function readMBWGraph() {
  return {
    version: MBW_GRAPH_STORE.version,
    brand: MBW_GRAPH_STORE.brand,
    colors: [...MBW_GRAPH_STORE.colors],
    screens: { ...MBW_GRAPH_STORE.screens },
    routes: { ...MBW_GRAPH_STORE.routes },
    edges: [...MBW_GRAPH_STORE.edges],
    events: [...MBW_GRAPH_STORE.events],
  };
}

export { MBW_GRAPH_STORE };
export const mbwGraphStore = MBW_GRAPH_STORE;
export default MBW_GRAPH_STORE;
