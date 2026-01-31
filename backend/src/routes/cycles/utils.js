const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DEFAULT_CYCLE_LENGTH_DAYS = 30;

function toDateOnly(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(Date.UTC(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate(),
    ));
  }

  if (typeof value === 'string') {
    const parts = value.split('-').map(Number);
    if (parts.length === 3 && parts.every((num) => !Number.isNaN(num))) {
      const [year, month, day] = parts;
      return new Date(Date.UTC(year, month - 1, day));
    }
  }

  return null;
}

function getTodayDateOnly() {
  const today = new Date();
  return new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  ));
}

function calculateDaysRemaining(startDate) {
  const normalizedStartDate = toDateOnly(startDate);
  if (!normalizedStartDate) {
    return null;
  }

  const today = getTodayDateOnly();
  const daysPassed = Math.max(
    0,
    Math.floor((today.getTime() - normalizedStartDate.getTime()) / DAY_IN_MS),
  );
  return Math.max(0, DEFAULT_CYCLE_LENGTH_DAYS - daysPassed);
}

export {
  toDateOnly,
  getTodayDateOnly,
  calculateDaysRemaining,
  DEFAULT_CYCLE_LENGTH_DAYS,
};
