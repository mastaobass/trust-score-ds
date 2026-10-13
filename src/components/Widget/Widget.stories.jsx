import { useState } from "react";
import OmniscoreGauge from "../OmniscoreGauge/OmniscoreGauge";
import Widget from "./Widget";
import "../WidgetGrid/WidgetGrid.css";

export default {
  title: "Primitives/Widget",
  component: Widget,
  parameters: { layout: "padded" },
};

function Grid({ children }) {
  return <div className="ts-widget-grid">{children}</div>;
}

export const Small = {
  render: () => (
    <Grid>
      <Widget title="Reversals" size="small">Small is 1×1.</Widget>
    </Grid>
  ),
};

export const Sizes = {
  render: () => (
    <Grid>
      <Widget title="Small" size="small">1×1</Widget>
      <Widget title="Medium" size="medium">2×1</Widget>
      <Widget title="Large" size="large">2×2</Widget>
      <Widget title="Extra Large Portrait" size="xlPortrait">1×2</Widget>
    </Grid>
  ),
};

function EditModeDemo() {
  const [size, setSize] = useState("medium");
  const [note, setNote] = useState("");
  return (
    <>
      <Grid>
        <Widget
          id="demo"
          title="Order information"
          size={size}
          editMode
          onSizeChange={setSize}
          onRemove={() => setNote("Removed")}
          onEditWidgets={() => setNote("Edit widgets")}
          onEditContent={() => setNote("Edit content is a stub")}
        >
          <p>This body is obscured while edit mode is on.</p>
        </Widget>
      </Grid>
      {note ? <p>{note}</p> : null}
    </>
  );
}

export const EditMode = {
  render: () => <EditModeDemo />,
};

export const WithOmniscore = {
  render: () => (
    <Grid>
      <Widget title="Omniscore" size="small">
        <OmniscoreGauge value={63} />
      </Widget>
    </Grid>
  ),
};
