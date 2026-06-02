const sortStrategies = {
  price: (a, b) =>
    a.price - b.price,
  bedrooms: (a, b) =>
    a.bedrooms - b.bedrooms,
  listedAt: (a, b) =>
    new Date(a.listedAt) -
    new Date(b.listedAt),
};

export function applySorting(
  properties,
  sortOpts
) {
  const { sortBy, direction } = sortOpts;

  if (!sortBy) {
    return [...properties];
  }

  const comparator = sortStrategies[sortBy];

  if (!comparator) {
    throw new Error(
      `Unsupported sort field: ${sortBy}`
    );
  }

  const multiplier = direction === "desc"
    ? -1
    : 1;

  return [...properties].sort((a, b) => comparator(a, b) * multiplier);
}
