export interface Transaction {
  id: number;
  transactions_category: 'necessary' | 'desire' | 'saving' | 'investment';
  transactions_subcategory: string;
  transactions_name: string;
  transactions_amount: number;
  transactions_date: string;
}
