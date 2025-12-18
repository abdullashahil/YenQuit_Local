/**
 * Helper utilities to handle user ID compatibility (Integer IDs)
 */

/**
 * Determines if a value is likely an integer (or can be converted to one)
 */
export function isInteger(val) {
  return !isNaN(parseInt(val, 10));
}

/**
 * Normalizes user ID for database queries
 * Returns the appropriate query parameter and SQL fragment
 */
export function normalizeUserIdForQuery(userId) {
  if (isInteger(userId)) {
    return {
      value: parseInt(userId, 10),
      sqlCast: '::integer', // Explicit cast just in case
      comparison: '= $1'
    };
  } else {
    // Fallback: try text comparison or error?
    // Since we are moving to integers, we should try to parse.
    // If it fails, return as string but likely will fail in DB if column is int.
    return {
      value: userId, // Keep original if not int? Or force 0/null?
      sqlCast: '::integer',
      comparison: '= $1'
    };
  }
}

/**
 * Creates a flexible WHERE clause for user_id
 */
export function createUserIdWhereClause(userId, alias = '') {
  const column = alias ? `${alias}.user_id` : 'user_id';
  // We don't really need normalizeUserIdForQuery complexity anymore if it's always int
  // But keeping structure for minimal code churn elsewhere
  return `${column} = $1`;
}

/**
 * Creates a flexible INSERT clause for user_id
 */
export function createUserIdInsertValue(userId) {
  return `$1`;
}

/**
 * Creates a flexible VALUES clause for user_id
 */
export function createUserIdValuesClause(userId, additionalParams = []) {
  // $1 is user_id
  const otherParams = additionalParams.map((_, i) => `$${i + 2}`).join(', ');
  return `($1, ${otherParams})`;
}
