export function formatToFirestore(obj: any): any {
  const fields: any = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      // O Firestore distingue entre integerValue e doubleValue
      fields[key] = Number.isInteger(value) 
        ? { integerValue: value.toString() } 
        : { doubleValue: value };
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (Array.isArray(value)) {
      fields[key] = {
        arrayValue: {
          values: value.map(v => (typeof v === 'object' 
            ? { mapValue: formatToFirestore(v) } 
            : formatToValue(v)))
        }
      };
    } else if (value && typeof value === 'object') {
      fields[key] = { mapValue: formatToFirestore(value) };
    }
  }
  return { fields };
}

function formatToValue(v: any): any {
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'number') return { integerValue: v.toString() };
  return { stringValue: String(v) };
}