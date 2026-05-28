import { describe, expect, it } from "vitest";

import {
  createAssetCandidatePaths,
  createAssetImageResolver,
} from "./create-asset-image-resolver";

describe("createAssetCandidatePaths", () => {
  it("cria candidatos para extensões suportadas quando assetKey não possui extensão", () => {
    const result = createAssetCandidatePaths({
      assetKey: "items/armas/espada",
      assetsRoot: "../../../assets",
    });

    expect(result).toEqual([
      "../../../assets/items/armas/espada.png",
      "../../../assets/items/armas/espada.jpg",
      "../../../assets/items/armas/espada.jpeg",
      "../../../assets/items/armas/espada.webp",
    ]);
  });

  it("mantém extensão quando assetKey já possui extensão conhecida", () => {
    const result = createAssetCandidatePaths({
      assetKey: "items/armas/espada.webp",
      assetsRoot: "../../../assets",
    });

    expect(result).toEqual(["../../../assets/items/armas/espada.webp"]);
  });

  it("normaliza barra inicial", () => {
    const result = createAssetCandidatePaths({
      assetKey: "/items/armas/espada",
      assetsRoot: "../../../assets",
      extensions: ["png"],
    });

    expect(result).toEqual(["../../../assets/items/armas/espada.png"]);
  });

  it("normaliza barras do Windows", () => {
    const result = createAssetCandidatePaths({
      assetKey: "items\\armas\\espada",
      assetsRoot: "../../../assets",
      extensions: ["png"],
    });

    expect(result).toEqual(["../../../assets/items/armas/espada.png"]);
  });

  it("remove prefixo assets quando informado no assetKey", () => {
    const result = createAssetCandidatePaths({
      assetKey: "assets/items/armas/espada",
      assetsRoot: "../../../assets",
      extensions: ["png"],
    });

    expect(result).toEqual(["../../../assets/items/armas/espada.png"]);
  });

  it("remove prefixo relativo até assets quando informado no assetKey", () => {
    const result = createAssetCandidatePaths({
      assetKey: "../../../assets/items/armas/espada",
      assetsRoot: "../../../assets",
      extensions: ["png"],
    });

    expect(result).toEqual(["../../../assets/items/armas/espada.png"]);
  });
});

describe("createAssetImageResolver", () => {
  const placeholderSrc = "placeholder-src";

  it("retorna placeholder quando assetKey é null", () => {
    const resolveImage = createAssetImageResolver({
      assetModules: {},
      assetsRoot: "../../../assets",
      placeholderSrc,
    });

    expect(resolveImage(null)).toBe(placeholderSrc);
  });

  it("retorna placeholder quando assetKey é vazio", () => {
    const resolveImage = createAssetImageResolver({
      assetModules: {},
      assetsRoot: "../../../assets",
      placeholderSrc,
    });

    expect(resolveImage("   ")).toBe(placeholderSrc);
  });

  it("retorna imagem encontrada em png", () => {
    const resolveImage = createAssetImageResolver({
      assetModules: {
        "../../../assets/items/armas/espada.png": "espada-png-src",
      },
      assetsRoot: "../../../assets",
      placeholderSrc,
    });

    expect(resolveImage("items/armas/espada")).toBe("espada-png-src");
  });

  it("retorna imagem encontrada em webp", () => {
    const resolveImage = createAssetImageResolver({
      assetModules: {
        "../../../assets/items/armas/espada.webp": "espada-webp-src",
      },
      assetsRoot: "../../../assets",
      placeholderSrc,
    });

    expect(resolveImage("items/armas/espada")).toBe("espada-webp-src");
  });

  it("retorna placeholder quando não encontra imagem", () => {
    const resolveImage = createAssetImageResolver({
      assetModules: {
        "../../../assets/items/armas/adaga.png": "adaga-src",
      },
      assetsRoot: "../../../assets",
      placeholderSrc,
    });

    expect(resolveImage("items/armas/espada")).toBe(placeholderSrc);
  });

  it("permite placeholder null", () => {
    const resolveImage = createAssetImageResolver({
      assetModules: {},
      assetsRoot: "../../../assets",
      placeholderSrc: null,
    });

    expect(resolveImage("items/armas/inexistente")).toBeNull();
  });

  it("usa candidateAssetKeys para tentar caminhos alternativos", () => {
    const resolveImage = createAssetImageResolver({
      assetModules: {
        "../../../assets/jobs/icons/arcanista.png": "arcanista-src",
      },
      assetsRoot: "../../../assets",
      placeholderSrc: null,
      extensions: ["png"],
      candidateAssetKeys: (assetKey) => [
        assetKey,
        `jobs/${assetKey}`,
        `jobs/icons/${assetKey}`,
      ],
    });

    expect(resolveImage("arcanista")).toBe("arcanista-src");
  });
});