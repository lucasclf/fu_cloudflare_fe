import { describe, expect, it } from "vitest";

import { isExternalImageUrl } from "./is-external-image-url";

describe("isExternalImageUrl", () => {
  it("reconhece URLs http e https", () => {
    expect(isExternalImageUrl("https://res.cloudinary.com/demo/image/upload/x.png")).toBe(true);
    expect(isExternalImageUrl("http://example.com/x.png")).toBe(true);
  });

  it("rejeita chaves de asset empacotado e valores vazios", () => {
    expect(isExternalImageUrl("dracoardil")).toBe(false);
    expect(isExternalImageUrl("")).toBe(false);
    expect(isExternalImageUrl(null)).toBe(false);
    expect(isExternalImageUrl(undefined)).toBe(false);
  });
});
