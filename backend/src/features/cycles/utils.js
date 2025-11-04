export const RESETTABLE_TYPES = ['important', 'wish'];
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getTodayDateOnly() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(Date.UTC(
      value.getUTCFullYear ? value.getUTCFullYear() : value.getFullYear(),
      (value.getUTCMonth ? value.getUTCMonth() : value.getMonth()),
      value.getUTCDate ? value.getUTCDate() : value.getDate()
    ));
  }

  if (typeof value === 'string') {
    const parts = value.split('-').map(Number);

    if (parts.length === 3 && parts.every((num) => !Number.isNaN(num))) {
      const [year, month, day] = parts;
      return new Date(Date.UTC(year, month - 1, day));
    }

    return null;
  }

  return null;
}

function shouldResetCycle(user, cycleStartDate, currentDate) {
  if (!user) {
    return false;
  }

  const cycleLength = 30;

  const start = parseDateOnly(cycleStartDate);
  const current = parseDateOnly(currentDate);

  if (!start || !current) {
    return false;
  }

  const daysPassed = Math.floor((current.getTime() - start.getTime()) / DAY_IN_MS);
  return daysPassed >= cycleLength;
}

export { getTodayDateOnly, shouldResetCycle };
