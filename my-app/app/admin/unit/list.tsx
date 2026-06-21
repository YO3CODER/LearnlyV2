import React from "react";
import {
  Datagrid,
  List,
  TextField,
  useListContext,
} from "react-admin";

const FilteredDatagrid = () => {
  const { data = [], isPending } = useListContext();
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const recent = React.useMemo(() => {
    return [...data].sort((a, b) => b.id - a.id).slice(0, 5);
  }, [data]);

  const filtered = React.useMemo(() => {
    if (!debouncedSearch.trim()) return [];

    return data.filter((row) =>
      row.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      row.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      row.courseTitle?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [data, debouncedSearch]);

  const isSearching = debouncedSearch.trim();
  const showNoResult = isSearching && filtered.length === 0;

  return (
    <>
      <div style={{ display: "flex", gap: 16, padding: "12px 0" }}>
        <input
          placeholder="Rechercher une unité ou un cours..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: 4,
            width: 300,
            fontSize: 14,
          }}
        />
      </div>

      {isPending ? (
        <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
          Chargement...
        </div>
      ) : showNoResult ? (
        <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
          Aucun résultat pour "<strong>{debouncedSearch}</strong>"
        </div>
      ) : (
        <>
          {!isSearching && (
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px 0" }}>
              5 unités les plus récentes
            </p>
          )}
          <Datagrid
            rowClick="edit"
            data={isSearching ? filtered : recent}
          >
            <TextField source="id" label="ID" />
            <TextField source="title" label="Titre" />
            <TextField source="description" label="Description" />
            <TextField source="courseTitle" label="Cours" />
            <TextField source="order" label="Order" />
          </Datagrid>
        </>
      )}
    </>
  );
};

export const UnitList = () => {
  return (
    <List sort={{ field: "id", order: "ASC" }} perPage={1000}>
      <FilteredDatagrid />
    </List>
  );
};