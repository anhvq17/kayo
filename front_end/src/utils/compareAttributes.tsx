export const areAttributesEqual = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false
  const aSorted = [...a].sort((x, y) => x.attributeId.localeCompare(y.attributeId))
  const bSorted = [...b].sort((x, y) => x.attributeId.localeCompare(y.attributeId))
  return aSorted.every((val, i) => val.attributeId === bSorted[i].attributeId && val.valueId === bSorted[i].valueId)
}
