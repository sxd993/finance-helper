import { StepAuthUserInfo } from './RegisterUserInfo/StepAuthUserInfo';
import { StepAuthUserSettings } from './RegisterUserSettings/StepAuthUserSettings';
import { StepAuthUserOnboarding } from './RegisterOnboarding/StepAuthUserOnboarding';
import { useRegisterForm } from '@features/auth/model/useRegisterForm';

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
          onNext={() => setStep('userSettings')}
          onSwitchToLogin={onSwitchToLogin}
        />
      }

      {
        step === 'userOnboarding' &&
        <StepAuthUserOnboarding />
      }

      {
        step === 'userSettings' &&
        <StepAuthUserSettings
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onBack={() => setStep('userInfo')}
          isLoading={isLoading}
          hasIncome={!!watch('monthly_income')}
        />
      }
    </>
  )
}
