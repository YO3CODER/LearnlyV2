import React from "react";
import {
  Datagrid,
  List,
  TextField,
  NumberField,
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

  // 5 plus récents = les 5 derniers par ID
  const recent = React.useMemo(() => {
    return [...data].sort((a, b) => b.id - a.id).slice(0, 5);
  }, [data]);

  const filtered = React.useMemo(() => {
    if (!debouncedSearch.trim()) return [];

    return data.filter((row) =>
      row.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      row.unitTitle?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [data, debouncedSearch]);

  const showNoResult = debouncedSearch.trim() && filtered.length === 0;

  return (
    <>
      <div style={{ display: "flex", gap: 16, padding: "12px 0" }}>
        <input
          placeholder="Rechercher une leçon ou une unité..."
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
          {!debouncedSearch.trim() && (
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px 0" }}>
              5 leçons les plus récentes
            </p>
          )}
          <Datagrid
            rowClick="edit"
            data={debouncedSearch.trim() ? filtered : recent}
          >
            <TextField source="id" label="ID" />
            <TextField source="title" label="Titre" />
            <TextField source="unitTitle" label="Unité" />
            <NumberField source="order" label="Order" />
          </Datagrid>
        </>
      )}
    </>
  );
};

export const LessonList = () => {
  return (
    <List sort={{ field: "id", order: "ASC" }} perPage={1000}>
      <FilteredDatagrid />
    </List>
  );
};