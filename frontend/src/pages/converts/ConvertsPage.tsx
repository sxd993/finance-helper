import { useState } from 'react';

import { ConvertList } from '@entities/convert/ui/ConvertList';
import { useConverts } from '@entities/convert';
import { AddConvertModal } from '@features/add-converts';

export const ConvertsPage = () => {
  const { converts, isLoading } = useConverts();
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return <p>Загрузка</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="flex flex-col gap-6 pt-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Добавить конверты
          </button>
        </div>

        <ConvertList converts={converts} />
      </div>

      <AddConvertModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
};
