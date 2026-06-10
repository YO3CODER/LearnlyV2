// app/api/admin/televerser/route.ts
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const fichier = form.get("fichier") as File | null;

    if (!fichier) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }
    if (fichier.type !== "application/pdf") {
      return NextResponse.json({ error: "Le fichier doit être un PDF" }, { status: 400 });
    }

    const buffer = Buffer.from(await fichier.arrayBuffer());

    const resultat = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // crucial pour les PDF
          folder: "cours",
          format: "pdf",
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    });

    return NextResponse.json({ url: resultat.secure_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Échec de l'envoi" }, { status: 500 });
  }
}