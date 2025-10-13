import { RenderConvertIcon } from "@/shared/ui/RenderConvertIcon";

type ConvertSectionProps = {
  section_title: string;
  section_code: string;
  children: React.ReactNode;
};

export const ConvertSection: React.FC<ConvertSectionProps> = ({
  section_title,
  section_code,
  children,
}) => {

  return (
    <section className="flex flex-col gap-3 bg-white ">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          {RenderConvertIcon(section_code)}
          <h2 className='text-lg'>{section_title}</h2>
        </h3>
      </div>
      {children}
    </section>
  );
};
