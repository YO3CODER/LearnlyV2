import { 
  SimpleForm, Edit, TextInput, required,
  ImageInput, ImageField, useNotify
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

const ImageUploader = () => {
  const { setValue, register, getValues } = useFormContext();
  const notify = useNotify();
  const [preview, setPreview] = useState<string | null>(null);

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
        shouldDirty: true,
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

export const CourseEdit = () => {
  const transform = (data: any) => {
    const { imageFile, ...rest } = data;
    return rest;
  };

  return (
    <Edit transform={transform}>
      <SimpleForm>
        <TextInput
          source="id"
          disabled
          label="Id"
        />
        <TextInput
          source="title"
          validate={[required()]}
          label="Title"
        />
        <ImageUploader />
        <TextInput
          source="imageSrc"
          label="URL Image (auto)"
          disabled
        />
      </SimpleForm>
    </Edit>
  );
};