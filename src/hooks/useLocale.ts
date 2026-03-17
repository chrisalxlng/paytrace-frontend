import { useEffect, useState } from "react";

export const useLocale = () => {
  const [locale, setLocale] = useState(window.navigator.language);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLocale(window.navigator.language);
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () =>
      window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  return locale;
};
