"use client";
import { SessionProvider } from "next-auth/react";
import DataWrapper from "@/components/DataWrapper";

const SessionWrapper = ({ children }) => {
  return (
    <SessionProvider>
      <DataWrapper>{children}</DataWrapper>
    </SessionProvider>
  );
};

export default SessionWrapper;
