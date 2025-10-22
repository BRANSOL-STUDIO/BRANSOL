/**
 * Get days left in current month
 * @returns Number of days remaining in the current month
 */
export function getDaysLeftInMonth(): number {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  // Get last day of current month
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = today.getDate();
  
  return lastDayOfMonth - currentDay;
}

/**
 * Get total days in current month
 * @returns Total number of days in the current month
 */
export function getTotalDaysInMonth(): number {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get percentage of month completed
 * @returns Percentage (0-100) of how much of the month has passed
 */
export function getMonthProgressPercentage(): number {
  const today = new Date();
  const currentDay = today.getDate();
  const totalDays = getTotalDaysInMonth();
  
  return Math.round((currentDay / totalDays) * 100);
}

/**
 * Format the end of month date for display
 * @returns Formatted date string for end of current month
 */
export function formatEndOfMonth(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endOfMonth = new Date(year, month, lastDay);
  
  return endOfMonth.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric' 
  });
}

/**
 * Get current month name
 */
export function getCurrentMonthName(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

