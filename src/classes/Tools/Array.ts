export const ensureArray = (input: any): any[] => {
  if (input === undefined) return []
  if (input instanceof Array === false) input = [input]
  return input
}
