import type { Meta, StoryObj } from "@storybook/react";
import { IncidentsOverTimeView } from "./IncidentsOverTimeView";

const meta: Meta<typeof IncidentsOverTimeView> = {
  component: IncidentsOverTimeView,
  decorators: [(Story) => <div style={{ height: 300 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof IncidentsOverTimeView>;

export const Default: Story = {
  args: {
    data: [
      { month: "Jan", count: 8 },
      { month: "Feb", count: 6 },
      { month: "Mar", count: 10 },
      { month: "Apr", count: 12 },
      { month: "May", count: 5 },
      { month: "Jun", count: 9 },
      { month: "Jul", count: 7 },
      { month: "Aug", count: 11 },
      { month: "Sep", count: 14 },
      { month: "Oct", count: 0 },
      { month: "Nov", count: 10 },
      { month: "Dec", count: 8 },
    ],
  },
};
