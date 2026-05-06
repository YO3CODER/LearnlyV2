import {
  SimpleForm, Edit, TextInput, ReferenceInput,
  required, BooleanInput, useNotify, NumberInput, useRecordContext
} from "react-admin";
import { useController } from "react-hook-form";
import { useState, useEffect } from "react";

const ImageUploader = () => {
  const { field } = useController({ name: "imageSrc", defaultValue: null });
  const record = useRecordContext();
  const notify = useNotify();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (record?.imageSrc) {
      setPreview(record.imageSrc);
      field.onChange(record.imageSrc);
    }
  }, [record?.imageSrc]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      field.onChange(data.url);
      setPreview(data.url);
      notify("Image uploadée !", { type: "success" });
    } catch {
      notify("Erreur upload image", { type: "error" });
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontWeight: 600, marginBottom: 8, color: "#374151" }}>Image (optionnelle)</p>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: 200, marginBottom: 8, borderRadius: 8, border: "1px solid #E5E7EB", display: "block" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ padding: "8px", border: "1px solid #D1D5DB", borderRadius: "8px", width: "100%" }}
      />
    </div>
  );
};

const AudioUploader = () => {
  const { field } = useController({ name: "audioSrc", defaultValue: null });
  const record = useRecordContext();
  const notify = useNotify();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (record?.audioSrc) {
      setAudioUrl(record.audioSrc);
      field.onChange(record.audioSrc);
    }
  }, [record?.audioSrc]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      field.onChange(data.url);
      setAudioUrl(data.url);
      notify("Audio uploadé !", { type: "success" });
    } catch {
      notify("Erreur upload audio", { type: "error" });
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontWeight: 600, marginBottom: 8, color: "#374151" }}>Audio (optionnel)</p>
      {audioUrl && (
        <audio controls style={{ marginBottom: 8, width: "100%" }}>
          <source src={audioUrl} />
        </audio>
      )}
      <input
        type="file"
        accept="audio/*"
        onChange={handleChange}
        style={{ padding: "8px", border: "1px solid #D1D5DB", borderRadius: "8px", width: "100%" }}
      />
    </div>
  );
};

export const ChallengeOptionEdit = () => {
  const transform = (data: any) => {
    const { imageFile, ...rest } = data;
    return {
      ...rest,
      imageSrc: data.imageSrc ?? null,
      audioSrc: data.audioSrc ?? null,
      order: data.order ?? null,
      blank: data.blank ?? null,
    };
  };

  return (
    <Edit transform={transform}>
      <SimpleForm>
        <TextInput source="id" disabled label="ID" />
        <ReferenceInput source="challengeId" reference="challenges" />
        <TextInput source="text" validate={[required()]} label="Texte" fullWidth />
        <BooleanInput source="correct" label="Option correcte" />
        <NumberInput
          source="order"
          label="Order (WORD_BANK uniquement)"
          helperText="Position du mot dans la phrase correcte."
        />
        <NumberInput
          source="blank"
          label="Blank index (FILL_BLANK uniquement)"
          helperText="Index du blanc (0, 1, 2...)."
        />
        <ImageUploader />
        <AudioUploader />
      </SimpleForm>
    </Edit>
  );
};