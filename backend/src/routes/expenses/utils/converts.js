import { Convert, ConvertType } from '../../../db/index.js';

/**
 * Находит конверт пользователя по id.
 */
const findUserConvertById = async ({ userId, convertId, transaction }) =>
  Convert.findOne({
    where: { userId, id: convertId },
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
  convertId,
  requestedTypeCode,
  transaction,
}) => {
  const convert = await findUserConvertById({ userId, convertId, transaction });

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

export {
  findUserConvertById,
  findConvertTypeByCode,
  resolveConvertAndType,
};
