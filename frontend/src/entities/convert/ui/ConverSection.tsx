import { Heart, Star, Target, HandCoins } from 'lucide-react';

type ConvertSectionProps = {
  section_title: string;
  section_code?: string;
  children: React.ReactNode;
};

export const ConvertSection: React.FC<ConvertSectionProps> = ({
  section_title,
  section_code,
  children,
}) => {
  const renderIcon = (code?: string) => {
    switch (code) {
      case 'important':
        return <Heart className="w-5 h-5 text-orange-500" />;
      case 'wishes':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'saving':
        return <Target className="w-5 h-5 text-green-600" />;
      case 'investment':
        return <HandCoins className='w-5 h-5 text-primary' />
    }
  };
  return (
    <section className="flex flex-col gap-3 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          {renderIcon(section_code)}
          <span>{section_title}</span>
        </h3>
      </div>
      {children}
    </section>
  );
};
