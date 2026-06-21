import {
  SimpleForm, Create, TextInput, ReferenceInput,
  NumberInput, required, SelectInput, SaveButton, Toolbar, useNotify
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { useState } from "react";
import { Headphones, Loader2 } from "lucide-react";

const CHALLENGE_TYPES = [
  { id: "SELECT", name: "SELECT" },
  { id: "ASSIST", name: "ASSIST" },
  { id: "WORD_BANK", name: "WORD_BANK" },
  { id: "FILL_BLANK", name: "FILL_BLANK" },
  { id: "TRANSLATE", name: "TRANSLATE" },
  { id: "MATCH", name: "MATCH" },
  { id: "LISTEN", name: "LISTEN" },
];

const CustomToolbar = ({ isUploading }: { isUploading: boolean }) => (
  <Toolbar>
    <SaveButton disabled={isUploading} />
  </Toolbar>
);

const AudioUploader = ({ isUploading, setIsUploading }: { isUploading: boolean, setIsUploading: (v: boolean) => void }) => {
  const { setValue } = useFormContext();
  const notify = useNotify();
  const url = useWatch({ name: "question" }) ?? "";

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setValue("question", data.url, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      notify("Audio uploadé", { type: "success" });
    } catch {
      notify("Erreur upload audio", { type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: 16, padding: 16, borderRadius: 8, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Headphones size={18} color="#1D4ED8" />
        <p style={{ fontWeight: 600, color: "#1D4ED8", margin: 0 }}>Audio de la question (LISTEN)</p>
      </div>
      <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
        L'URL sera automatiquement placée dans le champ Question.
      </p>
      <input type="file" accept="audio/*" onChange={handleChange}
        style={{ padding: "8px", border: "1px solid #D1D5DB", borderRadius: "8px", width: "100%" }}
      />
      {url && (
        <audio controls style={{ marginTop: 8, width: "100%" }}>
          <source src={url} />
        </audio>
      )}
      {isUploading && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <Loader2 size={14} color="#6366F1" className="animate-spin" />
          <p style={{ color: "#6366F1", fontSize: 13, margin: 0 }}>Upload en cours...</p>
        </div>
      )}
    </div>
  );
};

const ChallengeFormFields = ({ isUploading, setIsUploading }: { isUploading: boolean, setIsUploading: (v: boolean) => void }) => {
  const type = useWatch({ name: "type" });
  const isListen = type === "LISTEN";

  return (
    <>
      <SelectInput
        source="type"
        choices={CHALLENGE_TYPES}
        validate={[required()]}
      />
      {isListen && (
        <>
          <TextInput
            source="name"
            label="Nom de la question (optionnel, repère admin)"
            helperText="Visible uniquement dans la liste admin, pas dans l'app."
            fullWidth
          />
          <AudioUploader isUploading={isUploading} setIsUploading={setIsUploading} />
        </>
      )}
      <TextInput
        source="question"
        validate={[required()]}
        label={isListen ? "URL Audio (auto-remplie)" : "Question"}
        fullWidth
      />
      <ReferenceInput source="lessonId" reference="lessons">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      <NumberInput source="order" validate={[required()]} label="Order" />
    </>
  );
};

export const ChallengeCreate = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Create>
      <SimpleForm toolbar={<CustomToolbar isUploading={isUploading} />}>
        <ChallengeFormFields isUploading={isUploading} setIsUploading={setIsUploading} />
      </SimpleForm>
    </Create>
  );
};