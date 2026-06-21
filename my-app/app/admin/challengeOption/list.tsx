import React from "react";
import {
  Datagrid, List, TextField,
  NumberField, useListContext, useRecordContext
} from "react-admin";

type FieldProps = {
  label?: string;
};

const AudioPlayer = (_props: FieldProps) => {
  const record = useRecordContext();
  const [show, setShow] = React.useState(false);

  if (!record?.audioSrc) return (
    <span style={{ color: "#9CA3AF", fontSize: 13 }}>—</span>
  );

  // Ne charge l'audio qu'au clic
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

  // loading="lazy" : le navigateur ne charge l'image que quand elle est visible
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
      row.text?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      row.challengeQuestion?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [data, debouncedSearch]);

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
          <NumberField source="id" label="ID" />
          <TextField source="challengeQuestion" label="Défi" />
          <TextField source="text" label="Texte" />
          <CorrectBadge label="Statut" />
          <NumberField source="order" label="Order" emptyText="—" />
          <NumberField source="blank" label="Blank" emptyText="—" />
          <ImagePreview label="Image" />
          <AudioPlayer label="Audio" />
        </Datagrid>
      )}
    </>
  );
};

export const ChallengeOptionList = () => {
  return (
    // perPage réduit à 10 pour moins de médias simultanés
    <List sort={{ field: "id", order: "ASC" }} perPage={10}>
      <FilteredDatagrid />
    </List>
  );
};