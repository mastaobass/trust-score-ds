import { useState } from "react";
import CaseDetail from "./CaseDetail";
import { QUEUE } from "../../lib/queue";

function CaseHarness({ id }) {
  const [rows, setRows] = useState(QUEUE);
  const [current, setCurrent] = useState(id);
  return (
    <CaseDetail
      id={current}
      rows={rows}
      onRowsChange={setRows}
      onBack={() => {}}
      onOpen={setCurrent}
    />
  );
}

export default {
  title: "Pages/CaseDetail",
  component: CaseDetail,
  parameters: { layout: "fullscreen" },
};

export const Northwind = {
  name: "Northwind · Payments Fraud case",
  render: () => <CaseHarness id={QUEUE[0]?.id ?? "10000-A"} />,
};

export const Harbor = {
  name: "Harbor · Payments Fraud case",
  render: () => <CaseHarness id={QUEUE[1]?.id ?? "10997-B"} />,
};
