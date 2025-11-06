import { client } from '@/shared/api/client';

export type UpdateConvertInvestmentPayload = {
  id: number;
  initial_amount: number;
  target_amount: number;
};

export const UpdateConvertInvestment = async (payload: UpdateConvertInvestmentPayload) => {
  const { id, ...data } = payload;
  const res = await client.patch(`/converts/${id}/investment`, data);
  return res.data;
}
