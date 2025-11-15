import { RegisterUserInfo } from './RegisterSteps/ui/RegisterUserInfo';
import { RegisterUserOnboarding } from './RegisterSteps/ui/RegisterUserOnboarding';
import { RegisterUserSettings } from './RegisterSteps/ui/RegisterUserSettings';

import { useRegisterForm } from '@/features/auth';
import { useSwitchRegisterStage } from './RegisterSteps/model/hooks/useSwitchRegisterStage'
import { onboardingCards } from './RegisterSteps';
import { usePreloadImages } from './RegisterSteps/model/hooks/usePreloadImages';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    isPending,
    form_errors,
    send_error
  } = useRegisterForm();
  const { step, onBack, onNext } = useSwitchRegisterStage();

  usePreloadImages(onboardingCards.map((card) => card.image));

  return (
    <>
      {
        step === 'userInfo' &&
        <RegisterUserInfo
          register={register}
          errors={form_errors}
          isLoading={isPending}
          onNext={onNext}
          onSwitchToLogin={onSwitchToLogin}
        />
      }

      {
        step === 'userOnboarding' &&
        <RegisterUserOnboarding
          onBack={onBack}
          onNext={onNext}
        />
      }

      {
        step === 'userSettings' &&
        <RegisterUserSettings
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onBack={onBack}
          isLoading={isPending}
          error={send_error}
        />
      }
    </>
  )
}
