import type { Meta, StoryObj } from "@storybook/react";
import { WidgetWrapper } from "./WidgetWrapper";

const meta: Meta<typeof WidgetWrapper> = {
  component: WidgetWrapper,
};

export default meta;
type Story = StoryObj<typeof WidgetWrapper>;

export const Default: Story = {
  args: {
    title: "Active Incidents",
    children: "Widget content goes here",
  },
};

export const EditMode: Story = {
  args: {
    title: "Active Incidents",
    isEditMode: true,
    colSpan: 1,
    children: "Widget content goes here",
  },
};

export const WithSizeSelector: Story = {
  args: {
    title: "Active Incidents",
    isEditMode: true,
    colSpan: 4,
    children: "Widget content goes here — full width",
  },
};
