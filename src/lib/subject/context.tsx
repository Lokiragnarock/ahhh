"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SUBJECT } from "./shared";

// The current subject slug, threaded down from the root layout (which reads
// it server-side from the subject_key cookie — same pattern as sync). Client
// components that need a subject-scoped localStorage key (KEYS in
// practice-store.ts) read it from here instead of each needing their own prop.
const SubjectContext = createContext<string>(DEFAULT_SUBJECT);

export function SubjectProvider({ subject, children }: { subject: string; children: React.ReactNode }) {
  return <SubjectContext.Provider value={subject}>{children}</SubjectContext.Provider>;
}

export function useSubject(): string {
  return useContext(SubjectContext);
}
