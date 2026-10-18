import type { Meta, StoryObj } from "@storybook/react";
import { KpiCard } from "./KpiCard";

const meta: Meta<typeof KpiCard> = {
  component: KpiCard,
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
  args: {
    title: "Avg Response Time",
    value: "04:32",
  },
};

export const CallAnswerTime: Story = {
  args: {
    title: "Avg Call Answer Time",
    value: "13s",
  },
};

export const TotalIncidents: Story = {
  args: {
    title: "Total Incidents",
    value: "101",
  },
};

export const TrendUp: Story = {
  args: {
    title: "Avg Response Time",
    value: "04:32",
    trend: "5.2%",
    trendDirection: "up",
  },
};

export const TrendDown: Story = {
  args: {
    title: "Avg Call Answer Time",
    value: "13s",
    trend: "3.1%",
    trendDirection: "down",
  },
};
