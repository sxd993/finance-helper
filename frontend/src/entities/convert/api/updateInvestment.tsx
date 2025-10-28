import { client } from '@/shared/api/client';

export type UpdateInvestmentPayload = {
  id: number;
  initial_amount: number;
  target_amount: number;
};

export const updateInvestment = async (payload: UpdateInvestmentPayload) => {
  const { id, ...data } = payload;
  const res = await client.patch(`/converts/${id}/investment`, data);
  return res.data;
}
