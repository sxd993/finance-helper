import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import { Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

type ConvertSectionProps = {
  section_title: string;
  section_code: string;
  section_limit: number | null;
  section_current_ammount: number | null;
  children: React.ReactNode;
};

export const ConvertSection: React.FC<ConvertSectionProps> = ({
  section_title,
  section_code,
  children,
}) => {

  return (
    <section className="flex flex-col gap-5 bg-white border-1 border-slate-200 p-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="text-base  text-slate-900 flex items-start flex-col">
          <div className="flex flex-row justify-center items-center gap-1">
            {renderConvertIcon(section_code)}
            <h2 className='text-lg'>{section_title}</h2>
          </div>
        </div>
        <NavLink to={`/converts/edit/${section_code}`}>
          <div className="flex shadow-2xl border-1 border-slate-300 rounded-2xl p-2">
            <Settings width={22} height={22} className="text-gray-900" />
          </div>
        </NavLink>
      </div>
      {children}
    </section>
  );
};
