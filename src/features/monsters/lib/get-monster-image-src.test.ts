import { describe, expect, it } from "vitest";

import { getMonsterImageSrc } from "./get-monster-image-src";

describe("getMonsterImageSrc", () => {
  it("resolve um asset existente pelo nome do arquivo", () => {
    expect(getMonsterImageSrc("alraune")).toContain("alraune");
  });

  it("é tolerante a acentos e caixa diferentes do nome do arquivo", () => {
    expect(getMonsterImageSrc("Alraune")).toBe(getMonsterImageSrc("alraune"));
  });

  it("retorna a própria URL quando imgKey é uma URL externa (Cloudinary)", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/v1/monster.png";
    expect(getMonsterImageSrc(url)).toBe(url);
  });

  it("retorna null quando imgKey é null", () => {
    expect(getMonsterImageSrc(null)).toBeNull();
  });

  it("retorna null quando não encontra o asset", () => {
    expect(getMonsterImageSrc("monstro_que_nao_existe")).toBeNull();
  });
});
