import { describe, expect, it } from "vitest";

import { getPcImageSrc, getPcPortraitImageSrc } from "./get-pc-image-src";

describe("getPcImageSrc", () => {
  it("resolve o asset base de um PC existente", () => {
    expect(getPcImageSrc("jurupari")).toContain("jurupari");
  });

  it("é tolerante a acentos e caixa diferentes do nome do arquivo", () => {
    expect(getPcImageSrc("Jurupari")).toBe(getPcImageSrc("jurupari"));
  });

  it("retorna a própria URL quando imgKey é uma URL externa (Cloudinary)", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/v1/pc.png";
    expect(getPcImageSrc(url)).toBe(url);
  });

  it("retorna o placeholder quando imgKey é null", () => {
    expect(getPcImageSrc(null)).toContain("placeholder");
  });

  it("retorna o placeholder quando não encontra o asset", () => {
    expect(getPcImageSrc("pc_que_nao_existe")).toContain("placeholder");
  });
});

describe("getPcPortraitImageSrc", () => {
  it("prioriza o asset _portrait quando existe", () => {
    expect(getPcPortraitImageSrc("jurupari")).toContain("jurupari_portrait");
  });

  it("retorna a própria URL quando imgKey é uma URL externa (Cloudinary)", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/v1/pc.png";
    expect(getPcPortraitImageSrc(url)).toBe(url);
  });

  it("retorna o placeholder quando não encontra o asset", () => {
    expect(getPcPortraitImageSrc("pc_que_nao_existe")).toContain("placeholder");
  });
});
