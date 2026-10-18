import type { Meta, StoryObj } from "@storybook/react";
import { SeverityBreakdownView } from "./SeverityBreakdownView";

const meta: Meta<typeof SeverityBreakdownView> = {
  component: SeverityBreakdownView,
  decorators: [(Story) => <div style={{ height: 300 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof SeverityBreakdownView>;

export const Default: Story = {
  args: {
    data: [
      { severity: "Critical", count: 8 },
      { severity: "High", count: 15 },
      { severity: "Medium", count: 42 },
      { severity: "Low", count: 35 },
    ],
    total: 100,
  },
};
