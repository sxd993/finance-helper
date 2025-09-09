import { useState, useMemo } from "react";
import { ConvertCard } from "../ui/ConvertCard";
import { ContainerTabs } from "../ui/ContainerTabs";
import type { Convert } from "../../../shared/types/types";

interface ConvertListProps {
    converts: Convert[];
}

export const ConvertList = ({ converts }: ConvertListProps) => {
    const [active, setActive] = useState<string | null>(converts[0]?.convert_type ?? null);

    const filteredConverts = useMemo(() => {
        if (!active) return [];
        return converts.filter((c) => c.convert_type === active);
    }, [converts, active]);

    return (
        <div className="flex flex-col gap-8">
            <ContainerTabs converts={converts} active={active} onChange={setActive} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredConverts.map((c) => (
                    <ConvertCard key={c.id} convert={c} />
                ))}
            </div>
        </div>
    );
};
