import type { Meta, StoryObj } from "@storybook/react";
import { IncidentsTable } from "./IncidentsTable";

const meta: Meta<typeof IncidentsTable> = {
  component: IncidentsTable,
  args: {
    page: 1,
    totalPages: 3,
    onPageChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof IncidentsTable>;

export const Default: Story = {
  args: {
    data: [
      {
        id: "1",
        timestamp: "1/1/2025, 10:00:00 AM",
        type: "Fire",
        severity: "High",
        responseTime: 300,
        callAnswerTime: 5,
        aiSummary: "Dumpster fire behind a store",
      },
      {
        id: "2",
        timestamp: "1/2/2025, 11:00:00 AM",
        type: "Medical",
        severity: "Critical",
        responseTime: 500,
        callAnswerTime: 10,
        aiSummary: "Fall at home, patient conscious",
      },
      {
        id: "3",
        timestamp: "1/3/2025, 12:00:00 PM",
        type: "Police",
        severity: "Medium",
        responseTime: 400,
        callAnswerTime: 8,
        aiSummary: "Suspicious person in a parking lot",
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
