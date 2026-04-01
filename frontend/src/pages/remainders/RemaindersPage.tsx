import { Coins, History, WalletCards } from "lucide-react";

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
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 pt-5 pb-20">
      <SectionTitle
        title="Баланс остатков"
        subtitle="Просматривайте суммы, которые остались после завершённых циклов"
        icon={<Coins className="w-6 h-6 text-primary" />}
      />
      <RemaindersSummaryCard summary={summary} onOpen={open} />
      <SectionTitle
        title="История перераспределений"
        subtitle="Куда были отправлены остатки, когда и в каком объёме"
        icon={<History className="w-6 h-6 text-primary" />}
      />
      <RemaindersHistoryList />
    </div>
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Перераспределить остаток"
      widthClassName="max-w-xl"
    >
      <RedistributeRemainderModal onClose={close} />
    </Modal>
    </>
  );
};
