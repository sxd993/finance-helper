import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createConvert,
  type CreateConvertPayload,
  type ConvertType,
  useConvertTypes,
} from '@entities/convert';
import { Modal } from '@/shared/ui/Modal';

interface AddConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ConvertFormState {
  name: string;
  type_code: string;
  monthly_limit: string;
  target_amount: string;
}

const createEmptyForm = (): ConvertFormState => ({
  name: '',
  type_code: '',
  monthly_limit: '',
  target_amount: '',
});

export const AddConvertModal = ({ isOpen, onClose, onSuccess }: AddConvertModalProps) => {
  const [forms, setForms] = useState<ConvertFormState[]>([createEmptyForm()]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [commonError, setCommonError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const {
    convert_types,
    isLoading: isTypesLoading,
    error: typesError,
  } = useConvertTypes();

  const createConvertMutation = useMutation({
    mutationFn: createConvert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['converts'] });
      queryClient.invalidateQueries({ queryKey: ['converts-info'] });
    },
  });

  const isSubmitting = createConvertMutation.isPending;

  useEffect(() => {
    if (!isOpen) {
      setForms([createEmptyForm()]);
      setFormErrors([]);
      setCommonError(null);
      createConvertMutation.reset();
    }
  }, [isOpen, createConvertMutation]);

  const typesByCode = useMemo(() => {
    const map = new Map<string, ConvertType>();
    convert_types.forEach((type) => map.set(type.code, type));
    return map;
  }, [convert_types]);

  const updateForm = (index: number, field: keyof ConvertFormState, value: string) => {
    setForms((prev) =>
      prev.map((form, i) =>
        i === index
          ? {
              ...form,
              [field]: value,
            }
          : form,
      ),
    );
  };

  const handleAddForm = () => {
    setForms((prev) => [...prev, createEmptyForm()]);
  };

  const handleRemoveForm = (index: number) => {
    setForms((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const buildPayloads = () => {
    const errors: string[] = [];
    const payloads: CreateConvertPayload[] = [];

    forms.forEach((form, index) => {
      const type = typesByCode.get(form.type_code);

      if (!form.name.trim()) {
        errors[index] = 'Укажите название конверта';
        return;
      }

      if (!type) {
        errors[index] = 'Выберите тип конверта';
        return;
      }

      let monthlyLimit: number | undefined;
      if (type.hasLimit) {
        const parsed = Number(form.monthly_limit);
        if (Number.isNaN(parsed) || parsed < 0) {
          errors[index] = 'Введите корректный месячный лимит';
          return;
        }
        monthlyLimit = parsed;
      }

      let targetAmount: number | undefined;
      if (type.accumulates) {
        if (form.target_amount.trim() === '') {
          targetAmount = undefined;
        } else {
          const parsed = Number(form.target_amount);
          if (Number.isNaN(parsed) || parsed < 0) {
            errors[index] = 'Введите корректную цель накопления';
            return;
          }
          targetAmount = parsed;
        }
      }

      payloads.push({
        name: form.name.trim(),
        type_code: type.code,
        monthly_limit: monthlyLimit,
        target_amount: targetAmount,
        is_active: true,
      });
    });

    setFormErrors(errors);

    if (errors.some(Boolean)) {
      return null;
    }

    if (payloads.length === 0) {
      setCommonError('Добавьте хотя бы один конверт');
      return null;
    }

    return payloads;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setCommonError(null);

    const payloads = buildPayloads();
    if (!payloads) {
      return;
    }

    try {
      await Promise.all(payloads.map((payload) => createConvertMutation.mutateAsync(payload)));

      setForms([createEmptyForm()]);
      setFormErrors([]);
      setCommonError(null);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create converts', error);
      setCommonError('Не удалось создать конверты. Попробуйте ещё раз.');
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-800 transition"
        disabled={isSubmitting}
      >
        Отмена
      </button>
      <button
        type="submit"
        form="add-converts-form"
        className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
        disabled={isSubmitting || isTypesLoading}
      >
        {isSubmitting ? 'Сохраняем...' : 'Создать конверты'}
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить конверты" footer={footer}>
      <form id="add-converts-form" className="space-y-6" onSubmit={handleSubmit}>
        {isTypesLoading && (
          <div className="text-sm text-gray-500">Загружаем типы конвертов...</div>
        )}

        {!isTypesLoading && typesError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Не удалось загрузить типы конвертов
          </div>
        )}

        {!isTypesLoading && !typesError && forms.map((form, index) => {
          const type = typesByCode.get(form.type_code);

          return (
            <div
              key={`convert-form-${index}`}
              className="rounded-2xl border border-gray-200 p-4 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Название конверта
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => updateForm(index, 'name', event.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Например, Продукты"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Тип</label>
                    <select
                      value={form.type_code}
                      onChange={(event) => updateForm(index, 'type_code', event.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        Выберите тип
                      </option>
                      {convert_types.map((typeOption) => (
                        <option key={typeOption.id} value={typeOption.code}>
                          {typeOption.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {type?.hasLimit && (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Месячный лимит
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.monthly_limit}
                        onChange={(event) => updateForm(index, 'monthly_limit', event.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  {type?.accumulates && (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Цель накопления (необязательно)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.target_amount}
                        onChange={(event) => updateForm(index, 'target_amount', event.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>

                {forms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveForm(index)}
                    className="text-sm text-red-500 hover:text-red-600 transition"
                    aria-label="Удалить конверт"
                  >
                    Удалить
                  </button>
                )}
              </div>

              {formErrors[index] && (
                <p className="text-sm text-red-500">{formErrors[index]}</p>
              )}
            </div>
          );
        })}

        {!isTypesLoading && !typesError && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleAddForm}
              className="px-4 py-2 rounded-xl text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + Добавить ещё конверт
            </button>
          </div>
        )}

        {commonError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {commonError}
          </div>
        )}
      </form>
    </Modal>
  );
};
