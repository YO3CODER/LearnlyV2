import { 
  SimpleForm, Edit, TextInput, required,
  ImageInput, ImageField, useNotify
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";

const ImageUploader = () => {
  const { setValue } = useFormContext();
  const notify = useNotify();
  const [preview, setPreview] = useState<string | null>(null);

  const imageFile = useWatch({ name: "imageFile" });

  useEffect(() => {
    if (!imageFile?.rawFile) return;

    const upload = async () => {
      const formData = new FormData();
      formData.append("file", imageFile.rawFile);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload échoué");

        const data = await res.json();

        console.log("✅ URL Cloudinary reçue :", data.url);

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

    upload();
  }, [imageFile]);

  return (
    <>
      <ImageInput
        source="imageFile"
        label="Image du cours"
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
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
    console.log("📦 DATA TRANSFORM :", JSON.stringify(data));
    const { imageFile, ...rest } = data;
    return rest;
  };

  return (
    <Edit transform={transform} mutationMode="pessimistic">
      {/* 👇 record permet d'initialiser imageSrc depuis la DB */}
      <SimpleForm>
        <TextInput source="id" disabled label="Id" />
        <TextInput source="title" validate={[required()]} label="Title" />
        <ImageUploader />
        {/* 👇 Ce champ doit être enabled pour que React-Admin l'inclue dans le submit */}
        <TextInput
          source="imageSrc"
          label="URL Image (auto)"
          disabled={false} // ✅ enabled mais en lecture seule via style
          InputProps={{ readOnly: true }}
          sx={{ "& input": { color: "gray", cursor: "not-allowed" } }}
        />
      </SimpleForm>
    </Edit>
  );
};