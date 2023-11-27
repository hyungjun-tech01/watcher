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
import MyRoot from "./MyRoot";
import "./index.css";
import "./i18n";
import { koKR } from "@mui/x-data-grid";
import { koKR as coreKoKR } from "@mui/material/locale";

const primaryBase = "#00b050";
const secondaryBase = "#283f4f";
const theme = createTheme(
  {
    palette: {
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
    },
  },
  koKR, // x-data-grid translations
  coreKoKR // core translations
);

const REACT_APP_MODE = "development";
const client = new QueryClient();
// const theme = createTheme();
const root = createRoot(document.getElementById("root") as HTMLElement);

if (REACT_APP_MODE === "development") {
  // "product"가 아닌 "develop"로 수정
  root.render(
    <React.StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <MyRoot />
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
