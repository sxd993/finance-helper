import { useTransactionModal } from "../model/useTransactionModal"

export const ModalTabs = () => {
    const { tabs, activeTab, setTab } = useTransactionModal();
    return (
        <div className="flex justify-around items-center">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setTab(tab)}
                    className={`py-2 px-12 text-sm rounded-lg ${activeTab === tab ? 'bg-primary text-white' : 'text-black border-[1px] border-slate-200 shadow-md'}`}
                    >
                    {tab === "income" ? "+ Доход" : "- Расход"}
                </button>
            ))}
        </div>
    )
}