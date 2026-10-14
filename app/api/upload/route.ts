import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "MEMBER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "File gambar wajib diunggah." },
        { status: 400 },
      );
    }

    const url = await saveUploadedFile(file);
    return NextResponse.json({ url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengunggah gambar.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
