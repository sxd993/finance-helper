import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { ChangePercent, ChangeProfileInfo } from "@/features/profile";

export function SettingsPage() {
  useScrollToTop();

  return (
    <div className="app-page-container flex flex-col gap-5">
      <ChangeProfileInfo />
      <ChangePercent />
    </div>
  );
}
