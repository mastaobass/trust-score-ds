import Breadcrumb from "./Breadcrumb";

const QUEUE = [
  { label: "Kount 360" },
  { label: "Payments Fraud" },
  { label: "Case Queue" },
];

const CASE = [
  { label: "Kount 360" },
  { label: "Payments Fraud" },
  { label: "Case Queue", href: "#/" },
  { label: "Case Details" },
];

export default {
  title: "Primitives/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/4xUv7jvv0soZmmXwCo830e/Fraud-Risk-Score-Explainer?node-id=198-355",
    },
  },
  args: {
    items: QUEUE,
  },
};

export const CaseQueue = {};

export const CaseDetails = {
  args: { items: CASE },
};
