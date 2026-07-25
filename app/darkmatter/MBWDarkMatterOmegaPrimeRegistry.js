import constitution from '../../darkmatter/MBW_DARK_MATTER_OMEGA_PRIME_CONSTITUTION_V1.json';
import registry from '../../darkmatter/MBW_OS_INHERITANCE_REGISTRY_V1.json';

export const MBW_DARK_MATTER_OMEGA_PRIME_ID = 'MBW_DARK_MATTER_OMEGA_PRIME';

export function getMBWDarkMatterConstitution() {
  return constitution;
}

export function getMBWOSRegistry() {
  return registry;
}

export function mbwResolveOSForPath(path = '') {
  const normalized = String(path).replace(/\\/g, '/');
  const match = registry.pathAdapters.find(
    (entry) => normalized === entry.prefix || normalized.startsWith(entry.prefix),
  );
  return match?.os || 'BLACK_HOLE_ZERO_RESIDUE_ENGINE';
}

export function mbwAllOSGoverned() {
  return registry.canonicalOS.every(
    (entry) => entry.parent === MBW_DARK_MATTER_OMEGA_PRIME_ID,
  );
}
