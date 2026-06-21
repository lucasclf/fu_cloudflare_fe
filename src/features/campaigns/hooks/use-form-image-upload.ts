import { useState } from "react";

import { useCampaignImageUpload } from "./use-campaign-image-upload";
import type { UploadEntityType } from "../types/campaign";

/**
 * Empacota o estado (imgUrl/uploading) + o fluxo de upload (useCampaignImageUpload)
 * que os formulários de criação/edição de entidade de campanha repetiam: cada um
 * declarava os mesmos 2 useState e espalhava as mesmas 5 props no ImageUploadField.
 * `imageFieldProps` é pensado para spread direto: `<ImageUploadField id="..." label="..." {...imageFieldProps} />`.
 */
export function useFormImageUpload(
  campaignId: number,
  entityType: UploadEntityType,
  initialUrl: string | null = null,
) {
  const [imgUrl, setImgUrl] = useState<string | null>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useCampaignImageUpload(campaignId, entityType);

  return {
    imgUrl,
    setImgUrl,
    uploading,
    imageFieldProps: {
      value: imgUrl,
      onChange: setImgUrl,
      onUploadFile: uploadFile,
      uploading,
      onUploadingChange: setUploading,
    },
  };
}
