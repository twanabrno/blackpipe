import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import en from "./langs/en";
import ar from "./langs/ar";
import krd from "./langs/krd";
import RtlMui from "./components/RtlMui";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    resources: {
      en: en,
      ar: ar,
      krd: krd,
    },
    supportedLngs: ["en", "ar", "krd"],
    fallbackLng: "en",
    detection: {
      order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
  });

const loadingMarkup = (
  <div className="py4 text-center">
    <h2> Loading... </h2>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Suspense fallback={loadingMarkup}>
    <BrowserRouter>
    <RtlMui>
      <App />
    </RtlMui>
    </BrowserRouter>
  </Suspense>
);
