import type { FiltersSchema } from "../../lib/types/GenericTableTypes";

export function FiltersPanel<TFilters extends object>({
  filters,
  schema,
  update
}: {
  filters: TFilters;
  schema: FiltersSchema<TFilters>;
  update: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
      {Object.entries(schema).map(([key, config]) => {
        const typedKey = key as keyof TFilters;
        const value = filters[typedKey];

        switch (config.type) {
          case "text":
            return (
              <input
                key={key}
                value={value as string}
                onChange={(e) => update(typedKey, e.target.value as any)}
                placeholder={key}
              />
            );

          case "select":
            return (
              <select
                key={key}
                value={value as any}
                onChange={(e) => update(typedKey, e.target.value as any)}
              >
                <option value="">—</option>
                {config.options.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            );

          case "multiselect":
            return (
              <select
                key={key}
                multiple
                value={value as any}
                onChange={(e) =>
                  update(
                    typedKey,
                    Array.from(e.target.selectedOptions, o => o.value) as any
                  )
                }
              >
                {config.options.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            );

          case "custom": {
            const C = config.component;
            return (
              <C
                key={key}
                value={value}
                onChange={(v: any) => update(typedKey, v)}
              />
            );
          }
        }
      })}
    </div>
  );
}
