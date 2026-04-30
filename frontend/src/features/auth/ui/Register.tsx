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
    watch,
    handleSubmit,
    onSubmit,
    validateUserInfoStep,
    distributionFields,
    distributionTotal,
    isDistributionValid,
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
          onValidate={validateUserInfoStep}
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
          watch={watch}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          distributionFields={distributionFields}
          distributionTotal={distributionTotal}
          isDistributionValid={isDistributionValid}
          onBack={onBack}
          isLoading={isPending}
          errors={form_errors}
          error={send_error}
        />
      }
    </>
  )
}
