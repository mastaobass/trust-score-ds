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
  title: "Compositions/CaseDetail",
  component: CaseDetail,
  parameters: { layout: "fullscreen" },
};

export const Northwind = {
  name: "Northwind · Payments Fraud case",
  render: () => <CaseHarness id="48291-C" />,
};

export const Harbor = {
  name: "Harbor · Payments Fraud case",
  render: () => <CaseHarness id="11904-A" />,
};
