import { type LoaderFunctionArgs } from "react-router";
import fs from "node:fs";
import path from "node:path";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname; // e.g. /uploads/thumb/filename.webp

  // Extract the relative path after /uploads/
  const relativePath = pathname.replace(/^\/uploads\//, "");
  
  // Use the same UPLOADS_PATH as the ImageService
  const uploadsDir = process.env.UPLOADS_PATH || path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadsDir, relativePath);

  // Security check: ensure the file is within the uploads directory
  const resolvedPath = path.resolve(filePath);
  const resolvedUploadsDir = path.resolve(uploadsDir);
  
  if (!resolvedPath.startsWith(resolvedUploadsDir)) {
    throw new Response("Forbidden", { status: 403 });
  }

  try {
    if (!fs.existsSync(filePath)) {
      throw new Response("Not Found", { status: 404 });
    }

    const file = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    let contentType = "application/octet-stream";
    if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
}
