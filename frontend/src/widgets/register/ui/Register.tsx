import { StepAuthUserInfo } from './RegisterUserInfo/StepAuthUserInfo';
import { StepAuthUserSettings } from './RegisterUserSettings/StepAuthUserSettings';
import { StepAuthUserOnboarding } from './RegisterOnboarding/StepAuthUserOnboarding';
import { useRegisterForm } from '@/features/auth';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const {
    step,
    setStep,
    register,
    handleSubmit,
    errors,
    watch,
    isLoading,
    error,
    onSubmit,
  } = useRegisterForm();
  return (
    <>
      {
        step === 'userInfo' &&
        <StepAuthUserInfo
          register={register}
          errors={errors}
          isLoading={isLoading}
          error={error}
          onNext={() => setStep('userOnboarding')}
          onSwitchToLogin={onSwitchToLogin}
        />
      }

      {
        step === 'userOnboarding' &&
        <StepAuthUserOnboarding
          onBack={() => setStep('userInfo')}
          onNext={() => setStep('userSettings')}
        />
      }

      {
        step === 'userSettings' &&
        <StepAuthUserSettings
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onBack={() => setStep('userInfo')}
          isLoading={isLoading}
          watch={watch}
          error={error}
        />
      }
    </>
  )
}
