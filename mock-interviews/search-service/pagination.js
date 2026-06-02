export function applyPagination(
  properties,
  pagOpts
) {
  const { page, pageSize } = pagOpts;

  if (page < 1) {
    throw new Error(
      "Page must be greater than 0"
    );
  }

  if (pageSize < 1) {
    throw new Error(
      "Page size must be greater than 0"
    );
  }

  const start = (page - 1) * pageSize;

  return {
    totalResults: properties.length,
    page,
    pageSize,
    results: properties.slice(
      start,
      start + pageSize
    ),
  };
}
