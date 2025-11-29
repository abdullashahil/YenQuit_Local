/**
 * Helper utilities to handle user ID compatibility between UUID and integer formats
 */

/**
 * Determines if a value is likely a UUID string
 */
export function isUUID(str) {
  if (typeof str !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

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
  if (isUUID(userId)) {
    return {
      value: userId,
      sqlCast: '::uuid',
      comparison: '= $1::uuid'
    };
  } else if (isInteger(userId)) {
    return {
      value: parseInt(userId, 10),
      sqlCast: '',
      comparison: '= $1'
    };
  } else {
    // Fallback: try text comparison
    return {
      value: String(userId),
      sqlCast: '::text',
      comparison: '::text = $1'
    };
  }
}

/**
 * Creates a flexible WHERE clause for user_id that works with both UUID and integer
 */
export function createUserIdWhereClause(userId, alias = '') {
  const column = alias ? `${alias}.user_id` : 'user_id';
  const { comparison } = normalizeUserIdForQuery(userId);
  return `${column} ${comparison}`;
}

/**
 * Creates a flexible INSERT clause for user_id that works with both UUID and integer
 */
export function createUserIdInsertValue(userId) {
  const { sqlCast } = normalizeUserIdForQuery(userId);
  return `$1${sqlCast}`;
}

/**
 * Creates a flexible VALUES clause for user_id that works with both UUID and integer
 * This is useful for dynamic INSERT statements
 */
export function createUserIdValuesClause(userId, additionalParams = []) {
  const { sqlCast } = normalizeUserIdForQuery(userId);
  const paramCount = additionalParams.length + 1;
  return `($1${sqlCast}, ${additionalParams.map((_, i) => `$${i + 2}`).join(', ')})`;
}
