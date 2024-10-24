"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Provider({ children }:{children: React.ReactNode}) {

  return (
    <QueryClientProvider client={new QueryClient()}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}