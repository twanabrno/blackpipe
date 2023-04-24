import Cookies from "js-cookie";
import React from "react";
import { useTranslation } from "react-i18next";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const RtlMui = ({ children }) => {
  const { t } = useTranslation();
  const currentLanguageCode = Cookies.get("i18next") || "en";
  return (
    <>
      {currentLanguageCode == "en" ? (
        <>{children}</>
      ) : (
        <CacheProvider value={cacheRtl}>
          <>{children}</>
        </CacheProvider>
      )}
    </>
  );
};

export default RtlMui;
