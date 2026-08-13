// Mirrors RooftopGarden.Domain.Enums — kept as string literals since the API
// serializes/accepts these enums as strings (JsonStringEnumConverter).
export const PLANT_TYPES = [
  'Flower',
  'Vegetable',
  'Herb',
  'Succulent',
  'Fruit',
  'Tree',
  'Shrub',
  'Vine',
  'Fern',
  'Grass',
  'Other',
] as const

export const SUNLIGHT_REQUIREMENTS = ['FullSun', 'PartialSun', 'PartialShade', 'FullShade'] as const

export const WATER_REQUIREMENTS = ['Low', 'Medium', 'High'] as const
