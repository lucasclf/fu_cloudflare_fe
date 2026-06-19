import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CloudinarySignaturePayload } from "@/shared/lib/upload-to-cloudinary";
import type { UploadEntityType, UploadSignatureDto } from "../types/campaign";

function mapDto(dto: UploadSignatureDto): CloudinarySignaturePayload {
  return {
    timestamp: dto.timestamp,
    signature: dto.signature,
    apiKey: dto.api_key,
    cloudName: dto.cloud_name,
    uploadPreset: dto.upload_preset,
    folder: dto.folder,
  };
}

export async function getUploadSignature(
  campaignId: number,
  entityType: UploadEntityType,
): Promise<CloudinarySignaturePayload> {
  const dto = await httpPost<UploadSignatureDto>(
    `${API_BASE_URL}/campaigns/${campaignId}/uploads/signature?entity_type=${entityType}`,
    {},
  );
  return mapDto(dto);
}
