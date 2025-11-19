import { client } from '@/shared/api/client';

interface RemainingDaysResponse {
    daysRemaining: number
}

export const GetRemainingDaysApi = async () => {
    const { data } = await client.get<RemainingDaysResponse>('/cycles/remaining-days');
    return data
};