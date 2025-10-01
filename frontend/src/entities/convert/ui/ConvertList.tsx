import { useMemo, useState } from 'react';

import type { Convert } from '@shared/types/types';

import { ContainerTabs } from './ContainerTabs';
import { ConvertCard } from './ConvertCard';

interface ConvertListProps {
  converts: Convert[];
}

export const ConvertList = ({ converts }: ConvertListProps) => {
  const [active, setActive] = useState<Convert['convert_type'] | null>(
    converts[0]?.convert_type ?? null,
  );

  const filteredConverts = useMemo(() => {
    if (!active) return [];
    return converts.filter((c) => c.convert_type === active);
  }, [converts, active]);

  const handleTabChange = (value: Convert['convert_type']) => setActive(value);

  return (
    <div className="flex flex-col gap-8">
      <ContainerTabs converts={converts} active={active} onChange={handleTabChange} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredConverts.map((c) => (
          <ConvertCard key={c.id} convert={c} />
        ))}
      </div>
    </div>
  );
};
