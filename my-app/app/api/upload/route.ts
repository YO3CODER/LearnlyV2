import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Détecter si c'est un audio ou une image
    const isAudio = file.type.startsWith("audio/");

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: isAudio ? "learnly/audio" : "learnly/images",
      resource_type: isAudio ? "video" : "image", // Cloudinary utilise "video" pour l'audio
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}