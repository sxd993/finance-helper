import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExpenseCard } from './ExpenseCard';

const meta = {
  component: ExpenseCard,
} satisfies Meta<typeof ExpenseCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    expense: {
      "name": "Вкусно и точка",
      "sum": 350,
      "convert_name": "Еда",
      "convert_type": "Необходимые расходы",
      "icon_color": "orange",
      "icon_name": "Utensils"
    }
  }
};