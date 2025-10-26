const sanitizeString = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
};

const parseNumericField = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

/**
 * Приводит входной payload к предсказуемому виду и возвращает
 * только те поля, которые используются при создании/редактировании трат.
 */
const extractExpenseSource = (raw = {}) => {
  if (raw && typeof raw === 'object' && raw.expense && typeof raw.expense === 'object') {
    return raw.expense;
  }

  return raw || {};
};

const parseExpensePayload = (raw = {}) => {
  const data = extractExpenseSource(raw);
  const parsedDate = parseNumericField(data.date);
  const normalizedConvertName = sanitizeString(data.convert_name);
  const fallbackConvertName = sanitizeString(data.convert_title);

  return {
    name: sanitizeString(data.name),
    convertName: normalizedConvertName || fallbackConvertName,
    convertType: sanitizeString(data.convert_type) || undefined,
    iconName: sanitizeString(data.icon_name),
    iconColor: sanitizeString(data.icon_color),
    sum: parseNumericField(data.sum),
    date: Number.isFinite(parsedDate) && parsedDate > 0 ? parsedDate : undefined,
  };
};

/**
 * Выполняет базовую валидацию нормализованного payload и
 * возвращает массив ошибок. Пустой массив означает, что данные валидны.
 */
const validateExpensePayload = (payload) => {
  const errors = [];

  if (!payload.name) {
    errors.push('Поле name обязательно');
  }

  if (!payload.convertName) {
    errors.push('Поле convert_name обязательно');
  }

  if (!payload.iconName) {
    errors.push('Поле icon_name обязательно');
  }

  if (!payload.iconColor) {
    errors.push('Поле icon_color обязательно');
  }

  if (!Number.isFinite(payload.sum) || payload.sum <= 0) {
    errors.push('Поле sum должно быть положительным числом');
  }

  if (
    payload.date !== undefined &&
    (!Number.isFinite(payload.date) || payload.date <= 0)
  ) {
    errors.push('Поле date должно содержать корректный unix timestamp');
  }

  if (payload.convertType !== undefined && !payload.convertType) {
    errors.push('Поле convert_type не может быть пустой строкой');
  }

  return errors;
};

export { parseExpensePayload, validateExpensePayload };
