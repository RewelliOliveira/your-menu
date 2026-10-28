import { describe, expect, it } from "vitest";

import { api, createAccount } from "./helpers";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

describe("uploads", () => {
  it("stores an image and serves it back", async () => {
    const { auth } = await createAccount();
    const { body } = await api()
      .post("/api/uploads")
      .set(auth)
      .attach("file", PNG, { filename: "pixel.png", contentType: "image/png" })
      .expect(201);

    const path = new URL(body.url).pathname;
    const image = await api().get(path).expect(200);
    expect(image.headers["content-type"]).toBe("image/png");
    expect(Buffer.compare(image.body, PNG)).toBe(0);
  });

  it("rejects files that are not images", async () => {
    const { auth } = await createAccount();
    await api()
      .post("/api/uploads")
      .set(auth)
      .attach("file", Buffer.from("<svg/>"), { filename: "fake.png", contentType: "image/png" })
      .expect(400);
  });
});
