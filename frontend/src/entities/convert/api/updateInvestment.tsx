import { client } from '@/shared/api/client';

export type UpdateInvestmentPayload = {
  id: number;
  initial_investment: number;
  current_value: number;
};

export const updateInvestment = async (payload: UpdateInvestmentPayload) => {
  const { id, ...data } = payload;
  const res = await client.patch(`/converts/${id}/investment`, data);
  return res.data;
}

