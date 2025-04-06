import { format, formatDistance, parseISO, isValid } from 'date-fns';

/**
 * Format a date to a standard display format
 * @param {Date|string} date - The date to format
 * @param {string} formatStr - The format string (default: 'MMMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a date as relative time (e.g., "2 days ago")
 * @param {Date|string} date - The date to format
 * @param {Object} options - Format options
 * @returns {string} Relative time string
 */
export const formatRelative = (date, options = {}) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return formatDistance(dateObj, new Date(), { addSuffix: true, ...options });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return '';
  }
};

/**
 * Format a date for display in a form input
 * @param {Date|string} date - The date to format
 * @returns {string} Date formatted as YYYY-MM-DD
 */
export const formatForInput = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Format a datetime for display in a form input
 * @param {Date|string} date - The date to format
 * @returns {string} Date formatted as YYYY-MM-DDTHH:mm
 */
export const formatDateTimeForInput = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    console.error('Error formatting datetime for input:', error);
    return '';
  }
};

export default {
  formatDate,
  formatRelative,
  formatForInput,
  formatDateTimeForInput
}; 