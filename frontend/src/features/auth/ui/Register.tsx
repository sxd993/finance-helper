import { RegisterUserInfo } from './RegisterSteps/ui/RegisterUserInfo';
import { RegisterUserOnboarding } from './RegisterSteps/ui/RegisterUserOnboarding';
import { RegisterUserSettings } from './RegisterSteps/ui/RegisterUserSettings';

import { useRegisterForm } from '@/features/auth';
import { useSwitchRegisterStage } from './RegisterSteps/model/hooks/useSwitchRegisterStage'
import { onboardingCards } from './RegisterSteps';
import { usePreloadImages } from './RegisterSteps/model/hooks/usePreloadImages';
import { clearRegisterDraft } from '@/features/auth/model/lib/registerDraft';
import type { RegisterFormData } from '@/features/auth';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const {
    register,
    watch,
    handleSubmit: handleFormSubmit,
    onSubmit,
    validateUserInfoStep,
    distributionFields,
    distributionTotal,
    isDistributionValid,
    isPending,
    form_errors,
    send_error
  } = useRegisterForm();
  const { step, onBack, onNext, reset } = useSwitchRegisterStage();

  usePreloadImages(onboardingCards.map((card) => card.image));

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    const isRegistered = await onSubmit(data);
    if (isRegistered) {
      reset();
    }
  };

  const handleSwitchToLogin = () => {
    clearRegisterDraft();
    reset();
    onSwitchToLogin();
  };

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
          onSwitchToLogin={handleSwitchToLogin}
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
          handleSubmit={handleFormSubmit}
          onSubmit={handleRegisterSubmit}
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
