import { client } from '@/shared/api/client';

export type UpdateConvertInvestmentPayload = {
  id: number;
  invested_amount: number;
  current_value: number;
};

export const UpdateConvertInvestment = async (payload: UpdateConvertInvestmentPayload) => {
  const { id, ...data } = payload;
  const res = await client.patch(`/converts/${id}/investment`, data);
  return res.data;
}
