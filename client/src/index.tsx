import React from 'react';

import { createRoot } from 'react-dom/client';
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MyRoot from './MyRoot';
import './index.css';
import './i18n';

const REACT_APP_MODE = "development";
const client = new QueryClient();
const theme = createTheme();
const root = createRoot(
  document.getElementById('root') as HTMLElement
);

if (REACT_APP_MODE === "development") { // "product"가 아닌 "develop"로 수정
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





