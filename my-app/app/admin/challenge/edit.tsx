import {
  SimpleForm, Edit, TextInput, ReferenceInput,
  NumberInput, required, SelectInput, SaveButton, Toolbar, useNotify
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
import { Headphones, Loader2 } from "lucide-react";
import { parseListenQuestion, buildListenQuestion } from "@/lib/listen-question";

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
  const question = useWatch({ name: "question" }) ?? "";
  const label = useWatch({ name: "questionLabel" }) ?? "";
  const { url } = parseListenQuestion(question);

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
      setValue("question", buildListenQuestion(label, data.url), { shouldDirty: true, shouldTouch: true, shouldValidate: true });
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

// Champ "Nom" : pré-rempli depuis le `question` existant à l'ouverture, réécrit `question` quand modifié.
const QuestionLabelInput = () => {
  const { setValue, getValues } = useFormContext();
  const label = useWatch({ name: "questionLabel" });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    const current = getValues("question") ?? "";
    const { label: existingLabel } = parseListenQuestion(current);
    if (existingLabel) {
      setValue("questionLabel", existingLabel, { shouldDirty: false });
    }
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const question = getValues("question") ?? "";
    const { url } = parseListenQuestion(question);
    if (!url) return;
    setValue("question", buildListenQuestion(label ?? "", url), { shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  return (
    <TextInput
      source="questionLabel"
      label="Nom de la question (optionnel, repère admin)"
      helperText="Visible uniquement dans la liste admin, pas dans l'app."
      fullWidth
    />
  );
};

const ChallengeFormFields = ({ isUploading, setIsUploading }: { isUploading: boolean, setIsUploading: (v: boolean) => void }) => {
  const type = useWatch({ name: "type" });
  const isListen = type === "LISTEN";

  return (
    <>
      <TextInput source="id" disabled label="ID" />
      <SelectInput
        source="type"
        choices={CHALLENGE_TYPES}
        validate={[required()]}
      />
      {isListen ? (
        <>
          <AudioUploader isUploading={isUploading} setIsUploading={setIsUploading} />
          <QuestionLabelInput />
        </>
      ) : null}
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

export const ChallengeEdit = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Edit>
      <SimpleForm toolbar={<CustomToolbar isUploading={isUploading} />}>
        <ChallengeFormFields isUploading={isUploading} setIsUploading={setIsUploading} />
      </SimpleForm>
    </Edit>
  );
};