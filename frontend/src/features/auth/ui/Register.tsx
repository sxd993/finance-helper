import { RegisterUserInfo } from './RegisterSteps/ui/RegisterUserInfo';
import { RegisterUserOnboarding } from './RegisterSteps/ui/RegisterUserOnboarding';
import { RegisterUserSettings } from './RegisterSteps/ui/RegisterUserSettings';

import { useRegisterForm } from '@/features/auth';
import { useSwitchRegisterStage } from './RegisterSteps/model/hooks/useSwitchRegisterStage'

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const {
    register,
    handleSubmit,
    watch,
    onSubmit,
    isPending,
    form_errors,
    send_error
  } = useRegisterForm();
  const { step, onBack, onNext } = useSwitchRegisterStage();
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
          watch={watch}
          error={send_error}
        />
      }
    </>
  )
}
