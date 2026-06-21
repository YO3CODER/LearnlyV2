import React from "react";
import {
  Datagrid,
  List,
  TextField,
  NumberField,
  SelectField,
  useListContext,
} from "react-admin";

const CHALLENGE_TYPES = [
  { id: "SELECT", name: "SELECT" },
  { id: "ASSIST", name: "ASSIST" },
  { id: "WORD_BANK", name: "WORD_BANK" },
  { id: "FILL_BLANK", name: "FILL_BLANK" },
  { id: "TRANSLATE", name: "TRANSLATE" },
  { id: "MATCH", name: "MATCH" },
  { id: "LISTEN", name: "LISTEN" },
];

const FilteredDatagrid = () => {
  const { data = [], isPending } = useListContext();
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = React.useMemo(() => {
    return data.filter((row) => {
      const matchQuestion = row.question
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchType = typeFilter ? row.type === typeFilter : true;
      return matchQuestion && matchType;
    });
  }, [data, debouncedSearch, typeFilter]);

  return (
    <>
      <div style={{ display: "flex", gap: 16, padding: "12px 0" }}>
        <input
          placeholder="Rechercher une question..."
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
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          <option value="">Tous les types</option>
          {CHALLENGE_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
          Chargement...
        </div>
      ) : (
        <Datagrid rowClick="edit" data={filtered}>
          <NumberField source="id" label="ID" />
          <TextField source="question" label="Question" />
          <SelectField source="type" choices={CHALLENGE_TYPES} label="Type" />
          <NumberField source="lessonId" label="Leçon ID" />
          <NumberField source="order" label="Order" />
        </Datagrid>
      )}
    </>
  );
};

export const ChallengeList = () => {
  return (
    <List sort={{ field: "id", order: "ASC" }} perPage={25}>
      <FilteredDatagrid />
    </List>
  );
};