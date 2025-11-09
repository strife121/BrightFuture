import React from "react";
import { createRoot } from "react-dom/client";
import {
  initPlasmicLoader,
  PlasmicRootProvider,
  PlasmicComponent,
} from "@plasmicapp/loader-react";

const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "7Bo67viuWaudxLwWeikc65",
      token: "OOTFM6VQExooerroBlar8CHQZazF8j89WvK0KILhMSj9DhrVTkegCt3ybhkLqViRfl48UgNvoPDdXIwsWW4g",
    },
  ],
  version: "published",
});

function App() {
  const params = new URLSearchParams(location.search);
  const component = params.get("component") || "LandingTop";
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <PlasmicComponent component={component} />
    </PlasmicRootProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
