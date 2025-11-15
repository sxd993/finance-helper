import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { ChangeIncome, ChangePercent, ChangeProfileInfo } from "@/features/profile";

export function SettingsPage() {
  useScrollToTop();

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto pt-5 pb-20 p-4">
      <ChangeProfileInfo />
      <ChangePercent />
      <ChangeIncome />
    </div>
  );
}
