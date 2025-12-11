import React from "react";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { getConfig } from "utils/config";
import { Layout } from "./layout";
import { ConfigProvider } from "./config-provider";
import { ThemeProvider } from "../contexts/theme-context";

const MyApp = () => {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <ConfigProvider
          cssVariables={{
            "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
            "--zmp-background-color": "#F8FAFC",
          }}
        >
          <App>
            <SnackbarProvider>
              <ZMPRouter>
                <Layout />
              </ZMPRouter>
            </SnackbarProvider>
          </App>
        </ConfigProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};
export default MyApp;
