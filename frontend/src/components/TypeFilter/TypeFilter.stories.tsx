import type { Meta, StoryObj } from "@storybook/react";
import { TypeFilter } from "./TypeFilter";

const meta: Meta<typeof TypeFilter> = {
  component: TypeFilter,
};

export default meta;
type Story = StoryObj<typeof TypeFilter>;

export const Default: Story = {
  args: {
    value: undefined,
    onChange: () => {},
  },
};

export const FireSelected: Story = {
  args: {
    value: "Fire",
    onChange: () => {},
  },
};
