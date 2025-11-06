import { client } from '@/shared/api/client';

export const GetUserConvertsLimits = async () => {
    const response = await client.get('/converts/get-user-converts-type-limits');
    return response.data;
};