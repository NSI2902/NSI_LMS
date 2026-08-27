/**
 * Computes allowed portals based purely on backend role name
 * @param {string} role - Normalized role name ('STUDENT', 'INSTRUCTOR', 'ADMIN')
 * @returns {string[]} List of allowed portal identifiers
 */
export function getAllowedPortalsForRole(role) {
  if (!role) return [];
  const normalized = String(role).toUpperCase().trim();
  switch (normalized) {
    case 'ADMIN':
      return ['student', 'instructor', 'admin'];
    case 'INSTRUCTOR':
      return ['instructor'];
    case 'STUDENT':
      return ['student'];
    default:
      return [];
  }
}
