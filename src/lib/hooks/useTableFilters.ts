// src/components/table/hooks/useTableFilters.ts

import { useState } from "react";

export function useTableFilters<T extends object>(initial: T) {
  const [filters, setFilters] = useState<T>(initial);

  function update<K extends keyof T>(key: K, value: T[K]) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function setPartial(obj: Partial<T>) {
    setFilters(prev => ({ ...prev, ...obj }));
  }

  return { filters, update, setPartial };
}
