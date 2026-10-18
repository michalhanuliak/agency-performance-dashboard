import type { Meta, StoryObj } from "@storybook/react";
import { ResponseTimeChartView } from "./ResponseTimeChartView";
import { TYPE_COLORS } from "@/utils/colors";

const meta: Meta<typeof ResponseTimeChartView> = {
  component: ResponseTimeChartView,
  decorators: [(Story) => <div style={{ height: 300 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ResponseTimeChartView>;

export const Default: Story = {
  args: {
    data: [
      { type: "Medical", seconds: 627, formatted: "10:27", fill: TYPE_COLORS.Medical },
      { type: "Fire", seconds: 497, formatted: "08:17", fill: TYPE_COLORS.Fire },
      { type: "Police", seconds: 797, formatted: "13:17", fill: TYPE_COLORS.Police },
      { type: "Traffic", seconds: 1007, formatted: "16:47", fill: TYPE_COLORS.Traffic },
    ],
  },
};
