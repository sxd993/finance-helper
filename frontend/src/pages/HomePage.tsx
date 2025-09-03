import { useAuth } from '../features/auth/hooks/useAuth';
import { ProfileSection } from '../features/home/components/ProfileSection';
import { ConvertSection } from '../features/home/ui/ConvertSection';


export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <ProfileSection user={user} monthly_income={user?.monthly_income}/>
      <ConvertSection/>
    </div>
  )
}