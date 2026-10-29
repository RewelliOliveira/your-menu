import { describe, expect, it } from "vitest";

import { api, createAccount } from "./helpers";

describe("auth", () => {
  it("registers a user with their own restaurant and logs in", async () => {
    const email = "dono@cantina.com";
    const { body: session } = await api()
      .post("/api/auth/register")
      .send({ name: "João Souza", restaurantName: "Cantina do João", email, password: "senha-segura" })
      .expect(201);

    expect(session.user).toMatchObject({ name: "João Souza", email });
    expect(session.expiresAt).toBeGreaterThan(Date.now());

    const { body: restaurant } = await api()
      .get("/api/restaurant")
      .set("Authorization", `Bearer ${session.token}`)
      .expect(200);
    expect(restaurant).toMatchObject({ slug: "cantina-do-joao", name: "Cantina do João", isOpen: false });

    const { body: login } = await api().post("/api/auth/login").send({ email: "DONO@cantina.com", password: "senha-segura" }).expect(200);
    expect(login.restaurantId).toBe(session.restaurantId);
  });

  it("gives each restaurant a unique slug", async () => {
    const first = await createAccount("Pizzaria Bella");
    const second = await createAccount("Pizzaria Bella");
    expect(second.slug).not.toBe(first.slug);
    expect(second.slug).toMatch(/^pizzaria-bella-\d+$/);
  });

  it("rejects duplicated emails, wrong passwords and invalid input", async () => {
    const body = { name: "Ana Lima", restaurantName: "Doceria", email: "ana@doceria.com", password: "senha-segura" };
    await api().post("/api/auth/register").send(body).expect(201);
    await api().post("/api/auth/register").send(body).expect(409);
    await api().post("/api/auth/register").send({ ...body, email: "outra@doceria.com", name: "Ana" }).expect(400);
    await api().post("/api/auth/register").send({ ...body, email: "invalido" }).expect(400);

    const { body: error } = await api().post("/api/auth/login").send({ email: body.email, password: "errada123" }).expect(401);
    expect(error.message).toBe("E-mail ou senha incorretos.");
  });

  it("protects admin routes", async () => {
    await api().get("/api/orders").expect(401);
    await api().get("/api/orders").set("Authorization", "Bearer token-invalido").expect(401);
  });

  it("isolates data between restaurants", async () => {
    const owner = await createAccount();
    const other = await createAccount();
    const { body: category } = await api().post("/api/categories").set(owner.auth).send({ name: "Lanches" }).expect(201);

    const { body: otherCategories } = await api().get("/api/categories").set(other.auth).expect(200);
    expect(otherCategories).toEqual([]);
    await api().put(`/api/categories/${category.id}`).set(other.auth).send({ name: "Invadido" }).expect(404);
  });
});
