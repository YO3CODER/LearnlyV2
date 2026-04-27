import { 
  SimpleForm, Create, TextInput, required,
  ImageInput, ImageField, useNotify
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

const ImageUploader = () => {
  const { setValue, register } = useFormContext();
  const notify = useNotify();
  const [preview, setPreview] = useState<string | null>(null);

  // Enregistrer le champ caché
  register("imageSrc");

  const handleChange = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload échoué");

      const data = await res.json();
      
      setValue("imageSrc", data.url, { 
        shouldValidate: true,
        shouldDirty: true 
      });
      setPreview(data.url);
      notify("Image uploadée avec succès !", { type: "success" });
    } catch {
      notify("Erreur lors de l'upload", { type: "error" });
    }
  };

  return (
    <>
      <ImageInput
        source="imageFile"
        label="Image du cours"
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
        onChange={(file) => handleChange(file)}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      {preview && (
        <img 
          src={preview} 
          alt="Preview" 
          style={{ width: 200, marginTop: 8, borderRadius: 8 }} 
        />
      )}
    </>
  );
};

export const CourseCreate = () => {
  const transform = (data: any) => {
    // S'assurer qu'on envoie imageSrc et pas imageFile
    const { imageFile, ...rest } = data;
    return rest;
  };

  return (
    <Create transform={transform}>
      <SimpleForm>
        <TextInput
          source="title"
          validate={[required()]}
          label="Title"
        />
        <ImageUploader />
      </SimpleForm>
    </Create>
  );
};