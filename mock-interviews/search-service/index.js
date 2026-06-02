import { properties } from './properties.js';
import { validateFilters, applyFilters } from './filters.js';
import { applySorting } from './sorting.js';
import { applyPagination } from './pagination.js';

function searchProperties(properties, filters, sortOpts, pagOpts) {
  validateFilters(filters);

  const filtered = applyFilters(properties, filters);
  const sorted = applySorting(filtered, sortOpts);
  const paginated = applyPagination(sorted, pagOpts);

  return paginated;
}

const filters = {
  city: "Seattle",
  minPrice: 500000,
  maxPrice: 800000,
  minBedrooms: 2,
  status: "ACTIVE",
};

const sortOpts = {
  sortBy: "price",
  direction: "desc"
};

const pagOpts = {
  page: 1,
  pageSize: 10
}

const filtered = searchProperties(properties, filters, sortOpts, pagOpts);
console.log(filtered)

