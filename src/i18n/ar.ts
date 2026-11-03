import { arCore } from './ar/core';
import { arOperations } from './ar/operations';
import { arRoles } from './ar/roles';

// English source text → Arabic. Split by area to keep each file manageable.
export const ar: Record<string, string> = {
  ...arCore,
  ...arOperations,
  ...arRoles
};
