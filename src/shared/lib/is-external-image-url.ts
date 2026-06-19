/**
 * Diferencia uma URL real (imagem enviada pelo usuário, ex.: Cloudinary) de
 * uma chave de asset empacotado no build (ex.: "dracoardil", usada pelos
 * resolvers `get-*-image-src.ts` para buscar em `import.meta.glob`).
 */
// Propositalmente retorna `boolean` (não `value is string`): a maioria dos
// usos faz `if (isExternalImageUrl(key)) return key;` e segue tratando `key`
// como uma chave de asset comum no restante da função — um type predicate
// faria o TS (incorretamente) estreitar esse `string` remanescente para
// `never`, já que ele não sabe que só uma fração das strings passa no regex.
export function isExternalImageUrl(value: string | null | undefined): boolean {
  return typeof value === "string" && /^https?:\/\//.test(value);
}
