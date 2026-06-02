const validators = {
  isPositiveNumber: (value) => typeof value === 'number' && !!value && !isNaN(value) && value > 0,
  isNonEmptyString: (value) => typeof value === 'string' && !!value,
}

const filterStrategies = {
  city: {
    match: (property, value) =>
      property.city.toLowerCase() === value.toLowerCase(),
    validate: (value) => validators.isNonEmptyString(value)
  },
  minPrice: {
    match: (property, value) =>
      property.price >= value,
    validate: (value) => validators.isPositiveNumber(value)
  },
  maxPrice: {
    match: (property, value) =>
      property.price <= value,
    validate: (value) => validators.isPositiveNumber(value)
  },
  minBedrooms: {
    match: (property, value) =>
      property.bedrooms >= value,
    validate: (value) => validators.isPositiveNumber(value)
  },
  status: {
    match: (property, value) =>
      property.status === value,
    validate: (value) =>
      typeof value === 'string' && !!value && ['ACTIVE', 'SOLD', 'PENDING'].includes(value)
  }
}

export function applyFilters(properties, filters) {
  if (!Object.keys(filters).length) {
    return [...properties];
  }

  return properties.filter(property =>
    Object.entries(filters).every(
      ([key, value]) =>
        filterStrategies[key].match(
          property,
          value
        )
    )
  );
}

export function validateFilters(filters) {
  for (const [key, value] of Object.entries(filters)) {
    const strategy = filterStrategies[key];

    if (!strategy) {
      throw new Error(
        `Unsupported filter: ${key}`
      );
    }

    const isValid = strategy.validate(value);

    if (!isValid) {
      throw new Error(
        `Invalid value for filter: ${key}`
      );
    }
  }

  if (
    filters.minPrice !== undefined &&
    filters.maxPrice !== undefined &&
    filters.minPrice > filters.maxPrice
  ) {
    throw new Error(
      "minPrice cannot exceed maxPrice"
    );
  }
}
