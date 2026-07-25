function stable(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stable(value[key])}`)
    .join(',')}}`;
}

function fnv1a(value) {
  let hash = 0x811c9dc5;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function mbwCreateProofEvent(previousHash, type, payload) {
  const body = {
    type,
    payload,
    at: new Date().toISOString(),
    previousHash: previousHash || 'GENESIS',
  };
  return Object.freeze({ ...body, hash: fnv1a(stable(body)) });
}

export function mbwVerifyProofChain(events = []) {
  let previous = 'GENESIS';
  for (const event of events) {
    const body = {
      type: event.type,
      payload: event.payload,
      at: event.at,
      previousHash: previous,
    };
    const rebuilt = Object.freeze({ ...body, hash: fnv1a(stable(body)) });
    if (rebuilt.hash !== event.hash) return false;
    previous = event.hash;
  }
  return true;
}
