import type { Convert } from '@shared/types/types';

interface ConvertListProps {
  converts: Convert[];
}

export const ConvertList = ({ converts }: ConvertListProps) => {


  return (
    <div className="flex flex-col gap-8">
      {converts}
    </div>
  );
};
