import React from "react";
import {
  Datagrid,
  List,
  TextField,
  NumberField,
  SelectField,
  useListContext,
} from "react-admin";
import { parseListenQuestion } from "@/lib/listen-question";

const CHALLENGE_TYPES = [
  { id: "SELECT", name: "SELECT" },
  { id: "ASSIST", name: "ASSIST" },
  { id: "WORD_BANK", name: "WORD_BANK" },
  { id: "FILL_BLANK", name: "FILL_BLANK" },
  { id: "TRANSLATE", name: "TRANSLATE" },
  { id: "MATCH", name: "MATCH" },
  { id: "LISTEN", name: "LISTEN" },
];

// Affiche le nom (LISTEN) ou la question brute (autres types)
const QuestionField = ({ record }: any) => {
  if (!record) return null;
  if (record.type !== "LISTEN") return <span>{record.question}</span>;
  const { label, url } = parseListenQuestion(record.question);
  return <span>{label || url}</span>;
};

// Texte utilisé pour matcher la recherche (nom si LISTEN, sinon question brute)
const getSearchableText = (row: any) => {
  if (row.type === "LISTEN") {
    const { label, url } = parseListenQuestion(row.question ?? "");
    return label || url;
  }
  return row.question ?? "";
};

const FilteredDatagrid = () => {
  const { data = [], isPending } = useListContext();
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
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
    if (!debouncedSearch.trim() && !typeFilter) return [];

    return data.filter((row) => {
      const matchQuestion = getSearchableText(row)
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchType = typeFilter ? row.type === typeFilter : true;
      return matchQuestion && matchType;
    });
  }, [data, debouncedSearch, typeFilter]);

  const isSearching = debouncedSearch.trim() || typeFilter;
  const showNoResult = isSearching && filtered.length === 0;

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
      ) : showNoResult ? (
        <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
          Aucun résultat pour "<strong>{debouncedSearch}</strong>"
        </div>
      ) : (
        <>
          {!isSearching && (
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px 0" }}>
              5 défis les plus récents
            </p>
          )}
          <Datagrid
            rowClick="edit"
            data={isSearching ? filtered : recent}
          >
            <NumberField source="id" label="ID" />
            <QuestionField source="question" label="Question" />
            <SelectField source="type" choices={CHALLENGE_TYPES} label="Type" />
            <TextField source="lessonTitle" label="Leçon" />
            <NumberField source="order" label="Order" />
          </Datagrid>
        </>
      )}
    </>
  );
};

export const ChallengeList = () => {
  return (
    <List sort={{ field: "id", order: "ASC" }} perPage={1000}>
      <FilteredDatagrid />
    </List>
  );
};