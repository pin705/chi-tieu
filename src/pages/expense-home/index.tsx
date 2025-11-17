import React, { Suspense } from "react";
import { Box, Page } from "zmp-ui";
import { Welcome } from "./welcome";
import { Summary } from "./summary";
import { RecentTransactions } from "./recent-transactions";

const ExpenseHomePage: React.FunctionComponent = () => {
  return (
    <Page className="relative flex-1 flex flex-col bg-gray-50">
      <Welcome />
      <Box className="flex-1 overflow-auto pb-20">
        <Suspense>
          <Summary />
        </Suspense>
        <Suspense>
          <RecentTransactions />
        </Suspense>
      </Box>
    </Page>
  );
};

export default ExpenseHomePage;
