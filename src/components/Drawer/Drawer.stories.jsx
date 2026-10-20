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
          "Right panel. Overlay mode is a fixed slide-over with scrim. Push mode docks beside content for Case Detail widget layout.",
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

export const PushMode = {
  name: "Push mode",
  render: function PushDemo() {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ display: "flex", minHeight: 280, border: "1px solid var(--ts-color-border-default)" }}>
        <div style={{ flex: 1, padding: 16 }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>
            Toggle push drawer
          </Button>
          <p style={{ marginTop: 12, color: "var(--ts-color-text-muted)", fontSize: "var(--ts-font-size-sm)" }}>
            Main column shrinks when the drawer is open — no overlay scrim.
          </p>
        </div>
        <Drawer mode="push" open={open} title="Widget layout" onClose={() => setOpen(false)}>
          <p style={{ margin: 0, color: "var(--ts-color-text-muted)", fontSize: "var(--ts-font-size-sm)" }}>
            PAGE VIEWS list lives here on Case Detail.
          </p>
        </Drawer>
      </div>
    );
  },
};
