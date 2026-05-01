import { Coins, History } from "lucide-react";

import {
  RemaindersHistoryList,
  RemaindersSummaryCard,
  RedistributeRemainderModal,
  useUserRemainders,
} from "@/features/remainders";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { Modal } from "@/shared/ui/Modal";
import { useModal } from "@/shared/ui/Modal/model/useModal";
import { SectionTitle } from "@/shared/ui/SectionTItle";

export const RemaindersPage = () => {
  useScrollToTop();
  const { summary } = useUserRemainders();
  const { isOpen, open, close } = useModal("redistribute-remainder");

  return (
    <>
      <div className="app-page-container">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
          <SectionTitle
            title="Баланс остатков"
            subtitle="Просматривайте суммы, которые остались после завершённых циклов"
            icon={<Coins className="w-6 h-6 text-primary" />}
          />
          <RemaindersSummaryCard summary={summary} onOpen={open} />
          <SectionTitle
            title="История остатков"
            subtitle="Когда остаток сформировался, по какой категории и на какую сумму"
            icon={<History className="w-6 h-6 text-primary" />}
          />
          <RemaindersHistoryList />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={close}
        widthClassName="max-w-xl"
        title="Распределить остаток"
      >
        <RedistributeRemainderModal onClose={close} />
      </Modal>
    </>
  );
};
