import { useState } from "react";
import Button from "../Button/Button";
import Drawer from "./Drawer";

export default {
  title: "Patterns/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Right slide-over panel with overlay. Closes on Esc, overlay click, or the close control. Used for Case Detail saved widget views.",
      },
    },
  },
};

export const BasicOpenClose = {
  name: "Basic open / close",
  render: function DrawerDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          Open drawer
        </Button>
        <Drawer open={open} title="Widget layout" onClose={() => setOpen(false)}>
          <p style={{ margin: 0, color: "var(--ts-color-text-muted)", fontSize: "var(--ts-font-size-sm)" }}>
            Saved views and page options appear here.
          </p>
        </Drawer>
      </div>
    );
  },
};
