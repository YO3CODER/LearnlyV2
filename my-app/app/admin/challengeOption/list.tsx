import {
  Datagrid, List, TextField, ReferenceField,
  NumberField, BooleanField, ImageField, useRecordContext
} from "react-admin";

type FieldProps = {
  label?: string;
};

const AudioPlayer = (_props: FieldProps) => {
  const record = useRecordContext();
  if (!record?.audioSrc) return (
    <span style={{ color: "#9CA3AF", fontSize: 13 }}>—</span>
  );
  return (
    <audio controls style={{ height: 35, width: 220 }}>
      <source src={record.audioSrc} />
    </audio>
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

export const ChallengeOptionList = () => {
  return (
    <List sort={{ field: "id", order: "ASC" }} perPage={25}>
      <Datagrid rowClick="edit">
        <NumberField source="id" label="ID" />
        <ReferenceField source="challengeId" reference="challenges" label="Défi" />
        <TextField source="text" label="Texte" />
        <CorrectBadge label="Statut" />
        <NumberField source="order" label="Order" emptyText="—" />
        <NumberField source="blank" label="Blank" emptyText="—" />
        <ImagePreview label="Image" />
        <AudioPlayer label="Audio" />
      </Datagrid>
    </List>
  );
};