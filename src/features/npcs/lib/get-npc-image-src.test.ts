import { describe, expect, it } from "vitest";

import { getNpcImageSrc } from "./get-npc-image-src";

describe("getNpcImageSrc", () => {
  it("resolve um asset existente pelo nome do arquivo", () => {
    expect(getNpcImageSrc("cid_gato")).toContain("cid_gato");
  });

  it("é tolerante a acentos e caixa diferentes do nome do arquivo", () => {
    expect(getNpcImageSrc("Cid_Gato")).toBe(getNpcImageSrc("cid_gato"));
  });

  it("retorna a própria URL quando imgKey é uma URL externa (Cloudinary)", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/v1/npc.png";
    expect(getNpcImageSrc(url)).toBe(url);
  });

  it("retorna null quando imgKey é null", () => {
    expect(getNpcImageSrc(null)).toBeNull();
  });

  it("retorna null quando não encontra o asset", () => {
    expect(getNpcImageSrc("npc_que_nao_existe")).toBeNull();
  });
});
