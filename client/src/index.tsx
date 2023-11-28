import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  ThemeProvider,
  createTheme,
  alpha,
  getContrastRatio,
} from "@mui/material/styles";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MyRoot from "./MyRoot";
import "./index.css";
import i18n from "./i18n";
import { koKR } from "@mui/x-data-grid";
import { koKR as coreKoKR } from "@mui/material/locale";
import ko from 'date-fns/locale/ko';

const primaryBase = "#00b050";
const secondaryBase = "#283f4f";
const platteValue = {
  primary: {
    main: primaryBase,
    light: alpha(primaryBase, 0.5),
    dark: alpha(primaryBase, 0.9),
    contrastText: "#fff",
  },
  secondary: {
    main: secondaryBase,
    light: alpha(secondaryBase, 0.5),
    dark: alpha(secondaryBase, 0.9),
    contrastText:
      getContrastRatio(secondaryBase, "#fff") > 4.5 ? "#fff" : "#111",
  },
};
const theme = i18n.resolvedLanguage === 'ko' ? createTheme(
  {
    palette: platteValue,
  },
  koKR, // x-data-grid translations
  coreKoKR // core translations
) : createTheme(
  {
    palette: platteValue,
  },
);

const REACT_APP_MODE = "development";
const client = new QueryClient();
const root = createRoot(document.getElementById("root") as HTMLElement);

if (REACT_APP_MODE === "development") {
  // "product"가 아닌 "develop"로 수정
  root.render(
    <React.StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={i18n.resolvedLanguage === 'ko' ? ko : undefined}>
              <MyRoot />
            </LocalizationProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
}
// if (REACT_APP_MODE === "production") {
//   root.render(
//     <RecoilRoot>
//       <QueryClientProvider client={client}>
//         <MyRoot />
//       </QueryClientProvider>
//     </RecoilRoot>
//   );
// }
