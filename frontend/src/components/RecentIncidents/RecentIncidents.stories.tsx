import type { Meta, StoryObj } from "@storybook/react";
import { RecentIncidentsView } from "./RecentIncidentsView";

const meta: Meta<typeof RecentIncidentsView> = {
  component: RecentIncidentsView,
};

export default meta;
type Story = StoryObj<typeof RecentIncidentsView>;

export const Default: Story = {
  args: {
    data: [
      {
        id: "INC-001",
        time: "2 min ago",
        type: "Medical",
        severity: "Critical",
        summary: "Cardiac arrest reported at 123 Main St, paramedics dispatched.",
      },
      {
        id: "INC-002",
        time: "8 min ago",
        type: "Fire",
        severity: "High",
        summary: "Smoke showing from a warehouse roof on Industrial Blvd.",
      },
      {
        id: "INC-003",
        time: "15 min ago",
        type: "Police",
        severity: "Medium",
        summary: "Burglary in progress at Oak Avenue residence, officers en route.",
      },
      {
        id: "INC-004",
        time: "23 min ago",
        type: "Traffic",
        severity: "Low",
        summary: "Minor fender bender on Highway 101 northbound, no injuries reported.",
      },
      {
        id: "INC-005",
        time: "31 min ago",
        type: "Medical",
        severity: "High",
        summary: "Allergic reaction at downtown restaurant, EMS requested.",
      },
    ],
  },
};
