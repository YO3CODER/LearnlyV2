import { 
  SimpleForm, Create, TextInput, ReferenceInput, 
  required, BooleanInput, ImageInput, ImageField, useNotify 
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

const ImageUploader = () => {
  const { setValue, register } = useFormContext();
  const notify = useNotify();
  const [preview, setPreview] = useState<string | null>(null);

  register("imageSrc");

  const handleChange = async (file: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setValue("imageSrc", data.url, { shouldValidate: true, shouldDirty: true });
      setPreview(data.url);
      notify("Image uploadée !", { type: "success" });
    } catch {
      notify("Erreur upload image", { type: "error" });
    }
  };

  return (
    <>
      <ImageInput
        source="imageFile"
        label="Image (optionnelle)"
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
        onChange={(file) => handleChange(file)}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      {preview && (
        <img src={preview} alt="Preview" style={{ width: 200, marginTop: 8, borderRadius: 8 }} />
      )}
    </>
  );
};

const AudioUploader = () => {
  const { setValue, register } = useFormContext();
  const notify = useNotify();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  register("audioSrc");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setValue("audioSrc", data.url, { shouldValidate: true, shouldDirty: true });
      setAudioUrl(data.url);
      notify("Audio uploadé !", { type: "success" });
    } catch {
      notify("Erreur upload audio", { type: "error" });
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontWeight: 600, marginBottom: 8, color: "#374151" }}>
        Audio (optionnel)
      </p>
      <input
        type="file"
        accept="audio/*"
        onChange={handleChange}
        style={{
          padding: "8px",
          border: "1px solid #D1D5DB",
          borderRadius: "8px",
          width: "100%",
        }}
      />
      {audioUrl && (
        <audio controls style={{ marginTop: 8, width: "100%" }}>
          <source src={audioUrl} />
        </audio>
      )}
    </div>
  );
};

export const ChallengeOptionCreate = () => {
  const transform = (data: any) => {
    const { imageFile, ...rest } = data;
    return rest;
  };

  return (
    <Create transform={transform}>
      <SimpleForm>
        <TextInput source="text" validate={[required()]} label="Text" />
        <BooleanInput source="correct" label="Correct option" />
        <ReferenceInput source="challengeId" reference="challenges" />
        <ImageUploader />
        <TextInput source="imageSrc" label="URL Image (auto)" disabled />
        <AudioUploader />
        <TextInput source="audioSrc" label="URL Audio (auto)" disabled />
      </SimpleForm>
    </Create>
  );
};