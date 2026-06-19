import { useCallback } from "react";

import { uploadToCloudinary } from "@/shared/lib/upload-to-cloudinary";
import { getUploadSignature } from "../api/get-upload-signature";
import type { UploadEntityType } from "../types/campaign";

/**
 * Orquestra o fluxo de upload de imagem de uma entidade de campanha:
 * pede a assinatura ao FUDB e envia o arquivo direto para o Cloudinary.
 * Usado como `onUploadFile` do `ImageUploadField` (componente genérico,
 * sem conhecimento de Cloudinary/campanhas).
 */
export function useCampaignImageUpload(campaignId: number, entityType: UploadEntityType) {
  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      const signature = await getUploadSignature(campaignId, entityType);
      return uploadToCloudinary(file, signature);
    },
    [campaignId, entityType],
  );

  return { uploadFile };
}
