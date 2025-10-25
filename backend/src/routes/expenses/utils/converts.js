const { Convert, ConvertType } = require('../../../db');

/**
 * Находит конверт пользователя по имени.
 */
const findUserConvertByName = async ({ userId, convertName, transaction }) =>
  Convert.findOne({
    where: { userId, name: convertName },
    transaction,
  });

/**
 * Убедиться, что код типа существует в справочнике convert_types.
 */
const findConvertTypeByCode = async ({ code, transaction }) =>
  ConvertType.findOne({
    where: { code },
    transaction,
  });

/**
 * Проверяет согласованность данных и возвращает найденные сущности.
 */
const resolveConvertAndType = async ({
  userId,
  convertName,
  requestedTypeCode,
  transaction,
}) => {
  const convert = await findUserConvertByName({ userId, convertName, transaction });

  if (!convert) {
    return { error: 'CONVERT_NOT_FOUND' };
  }

  const resolvedTypeCode = requestedTypeCode || convert.typeCode;

  if (requestedTypeCode && requestedTypeCode !== convert.typeCode) {
    return { error: 'TYPE_MISMATCH', convert };
  }

  const convertType = await findConvertTypeByCode({
    code: resolvedTypeCode,
    transaction,
  });

  if (!convertType) {
    return { error: 'TYPE_NOT_FOUND', convert };
  }

  return {
    convert,
    convertType,
    convertTypeCode: convertType.code,
  };
};

module.exports = {
  findUserConvertByName,
  findConvertTypeByCode,
  resolveConvertAndType,
};
