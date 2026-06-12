import React from "react";
import type { LocaleBundle } from "./locale";
import type { Lang } from "./lang";
import { LOCALES } from "./locale";

export interface LangCtx {
  lang: Lang;
  locale: LocaleBundle;
  young: boolean; /* true = 4yo "young reader" mode (French build) */
}

export const LangContext = React.createContext<LangCtx>({
  lang: "en",
  locale: LOCALES.en,
  young: false,
});

export const useLang = () => React.useContext(LangContext);
