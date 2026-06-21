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

  const filtered = React.useMemo(() => {
    return data.filter((row) =>
      row.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [data, debouncedSearch]);

  return (
    <>
      <div style={{ display: "flex", gap: 16, padding: "12px 0" }}>
        <input
          placeholder="Rechercher une leçon..."
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
      ) : (
        <Datagrid rowClick="edit" data={filtered}>
          <TextField source="id" label="ID" />
          <TextField source="title" label="Titre" />
          <TextField source="unitTitle" label="Unité" />
          <NumberField source="order" label="Order" />
        </Datagrid>
      )}
    </>
  );
};

export const LessonList = () => {
  return (
    <List sort={{ field: "id", order: "ASC" }} perPage={25}>
      <FilteredDatagrid />
    </List>
  );
};