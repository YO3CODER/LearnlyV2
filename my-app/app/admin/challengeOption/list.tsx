import React from "react";
import {
  Datagrid, List, TextField,
  NumberField, useListContext, useRecordContext
} from "react-admin";
import { parseListenQuestion } from "@/lib/listen-question";

type FieldProps = {
  label?: string;
};

const CHALLENGE_TYPES = [
  { id: "SELECT", name: "SELECT" },
  { id: "ASSIST", name: "ASSIST" },
  { id: "WORD_BANK", name: "WORD_BANK" },
  { id: "FILL_BLANK", name: "FILL_BLANK" },
  { id: "TRANSLATE", name: "TRANSLATE" },
  { id: "MATCH", name: "MATCH" },
  { id: "LISTEN", name: "LISTEN" },
];

const AudioPlayer = (_props: FieldProps) => {
  const record = useRecordContext();
  const [show, setShow] = React.useState(false);

  if (!record?.audioSrc) return (
    <span style={{ color: "#9CA3AF", fontSize: 13 }}>—</span>
  );

  return show ? (
    <audio controls style={{ height: 35, width: 180 }}>
      <source src={record.audioSrc} />
    </audio>
  ) : (
    <button
      onClick={() => setShow(true)}
      style={{
        padding: "4px 10px",
        fontSize: 12,
        borderRadius: 4,
        border: "1px solid #ccc",
        cursor: "pointer",
        background: "#f9fafb",
      }}
    >
      ▶ Écouter
    </button>
  );
};

const ImagePreview = (_props: FieldProps) => {
  const record = useRecordContext();
  if (!record?.imageSrc) return (
    <span style={{ color: "#9CA3AF", fontSize: 13 }}>—</span>
  );
  return (
    <img
      src={record.imageSrc}
      alt="option"
      loading="lazy"
      style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 6 }}
    />
  );
};

const CorrectBadge = (_props: FieldProps) => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <span style={{
      backgroundColor: record.correct ? "#D1FAE5" : "#FEE2E2",
      color: record.correct ? "#065F46" : "#991B1B",
      padding: "2px 10px",
      borderRadius: 999,
      fontWeight: 600,
      fontSize: 12,
    }}>
      {record.correct ? "✓ Correcte" : "✗ Incorrecte"}
    </span>
  );
};

// Affiche le nom décodé pour LISTEN ("Nom::URL" -> "Nom"), sinon la question brute
const ChallengeQuestionField = (_props: FieldProps) => {
  const record = useRecordContext();
  if (!record?.challengeQuestion) return (
    <span style={{ color: "#9CA3AF", fontSize: 13 }}>—</span>
  );
  if (record.challengeType !== "LISTEN") {
    return <span>{record.challengeQuestion}</span>;
  }
  const { label, url } = parseListenQuestion(record.challengeQuestion);
  return <span>{label || url}</span>;
};

// Texte utilisé pour matcher la recherche (nom si LISTEN, sinon question brute)
const getSearchableChallengeQuestion = (row: any) => {
  if (row.challengeType === "LISTEN") {
    const { label, url } = parseListenQuestion(row.challengeQuestion ?? "");
    return label || url;
  }
  return row.challengeQuestion ?? "";
};

const FilteredDatagrid = () => {
  const { data = [], isPending } = useListContext();
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 5000);
    return () => clearTimeout(timer);
  }, [search]);

  // 5 plus récentes = les 5 dernières par ID
  const recent = React.useMemo(() => {
    return [...data].sort((a, b) => b.id - a.id).slice(0, 5);
  }, [data]);

  const filtered = React.useMemo(() => {
    if (!debouncedSearch.trim() && !typeFilter) return [];

    return data.filter((row) => {
      const matchText =
        row.text?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        getSearchableChallengeQuestion(row)
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      const matchType = typeFilter ? row.challengeType === typeFilter : true;
      return matchText && matchType;
    });
  }, [data, debouncedSearch, typeFilter]);

  const isSearching = debouncedSearch.trim() || typeFilter;
  const showNoResult = isSearching && filtered.length === 0;

  return (
    <>
      <div style={{ display: "flex", gap: 16, padding: "12px 0" }}>
        <input
          placeholder="Rechercher par texte ou défi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: 4,
            width: 320,
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
          Aucun résultat pour "<strong>{debouncedSearch || typeFilter}</strong>"
        </div>
      ) : (
        <>
          {!isSearching && (
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px 0" }}>
              5 options les plus récentes
            </p>
          )}
          <Datagrid
            rowClick="edit"
            data={isSearching ? filtered : recent}
          >
            <NumberField source="id" label="ID" />
            <ChallengeQuestionField label="Défi" />
            <TextField source="text" label="Texte" />
            <CorrectBadge label="Statut" />
            <NumberField source="order" label="Order" emptyText="—" />
            <NumberField source="blank" label="Blank" emptyText="—" />
            <ImagePreview label="Image" />
            <AudioPlayer label="Audio" />
          </Datagrid>
        </>
      )}
    </>
  );
};

export const ChallengeOptionList = () => {
  return (
    <List sort={{ field: "id", order: "ASC" }} perPage={1000}>
      <FilteredDatagrid />
    </List>
  );
};