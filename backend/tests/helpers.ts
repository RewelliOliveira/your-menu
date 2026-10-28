import { randomUUID } from "node:crypto";
import request from "supertest";

import { app } from "../src/app";
import type { Session } from "../src/types/auth";

export const api = () => request(app);

export async function createAccount(restaurantName = "Casa de Teste") {
  const response = await api()
    .post("/api/auth/register")
    .send({ name: "Maria Silva", restaurantName, email: `${randomUUID()}@teste.com`, password: "senha-segura" })
    .expect(201);
  const session = response.body as Session;
  const auth = { Authorization: `Bearer ${session.token}` };
  const { body: restaurant } = await api().get("/api/restaurant").set(auth).expect(200);
  return { session, auth, slug: restaurant.slug as string };
}
