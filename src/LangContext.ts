import React from "react";
import type { LocaleBundle } from "./locale";
import type { Lang } from "./lang";
import { LOCALES } from "./locale";
import type { UIBundle } from "./i18n";
import { UI } from "./i18n";

export interface LangCtx {
  lang: Lang;
  locale: LocaleBundle;
  ui: UIBundle; /* connective-tissue page strings (cover, passport, quizzes, chrome…) */
}

export const LangContext = React.createContext<LangCtx>({
  lang: "en",
  locale: LOCALES.en,
  ui: UI.en,
});

export const useLang = () => React.useContext(LangContext);
