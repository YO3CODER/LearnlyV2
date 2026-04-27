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
    <span style={{ color: "#9CA3AF", fontSize: 13 }}>Aucun audio</span>
  );

  return (
    <audio controls style={{ height: 35, width: 220 }}>
      <source src={record.audioSrc} />
      Votre navigateur ne supporte pas l'audio.
    </audio>
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
    <List
      sort={{ field: "id", order: "ASC" }}
      perPage={25}
    >
      <Datagrid rowClick="edit">
        <NumberField source="id" label="ID" />
        <TextField source="text" label="Texte" />
        <CorrectBadge label="Statut" />
        <ReferenceField source="challengeId" reference="challenges" label="Défi" />
        <ImageField source="imageSrc" label="Image" />
        <AudioPlayer label="Audio" />
      </Datagrid>
    </List>
  );
};