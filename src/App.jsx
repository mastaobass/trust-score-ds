import { useCallback, useEffect, useState } from "react";
import ReviewQueue from "./components/ReviewQueue/ReviewQueue";
import CaseDetail from "./components/CaseDetail/CaseDetail";
import { QUEUE } from "./lib/queue";

function parseHash() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const match = raw.match(/^\/case\/([^/?#]+)/);
  if (match) return { name: "case", id: decodeURIComponent(match[1]) };
  return { name: "queue" };
}

export default function App() {
  const [route, setRoute] = useState(parseHash);
  const [rows, setRows] = useState(QUEUE);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const openCase = useCallback((id) => {
    window.location.hash = `/case/${id}`;
  }, []);

  const back = useCallback(() => {
    window.location.hash = "/";
  }, []);

  if (route.name === "case") {
    return (
      <CaseDetail
        id={route.id}
        rows={rows}
        onRowsChange={setRows}
        flash={flash}
        onFlash={setFlash}
        onBack={back}
        onOpen={openCase}
      />
    );
  }

  return (
    <ReviewQueue
      rows={rows}
      onRowsChange={setRows}
      onOpenCase={openCase}
      flash={flash}
    />
  );
}
