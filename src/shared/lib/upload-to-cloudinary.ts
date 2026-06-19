export type CloudinarySignaturePayload = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  uploadPreset: string;
  folder: string;
};

/**
 * Envia o arquivo direto para o Cloudinary usando uma assinatura de upload
 * já gerada pelo backend (ver `getUploadSignature`). O binário nunca passa
 * pelo Worker do FUDB — só os parâmetros assinados.
 */
export async function uploadToCloudinary(
  file: File,
  signature: CloudinarySignaturePayload,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("upload_preset", signature.uploadPreset);
  formData.append("folder", signature.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error?.message ?? "Não foi possível enviar a imagem.";
    throw new Error(message);
  }

  const data = await response.json() as { secure_url: string };
  return data.secure_url;
}
