import { describe, expect, it } from "vitest";

import { toDateKey, toMonthKey } from "../src/domain/month";
import { api, createAccount } from "./helpers";

describe("finance", () => {
  it("records manual transactions and summarizes the month", async () => {
    const { auth } = await createAccount();
    const today = toDateKey(new Date());
    const month = toMonthKey(new Date());

    const { body: expense } = await api()
      .post("/api/finance/transactions")
      .set(auth)
      .send({ type: "EXPENSE", category: "Aluguel", description: "Aluguel do ponto", amount: 1200.555, date: today })
      .expect(201);
    expect(expense.amount).toBe(1200.56);

    await api()
      .post("/api/finance/transactions")
      .set(auth)
      .send({ type: "INCOME", category: "Vendas no balcão", description: "Balcão", amount: 2000, date: today })
      .expect(201);

    const { body: report } = await api().get(`/api/finance/report?month=${month}`).set(auth).expect(200);
    expect(report.summary).toMatchObject({ revenue: 2000, expenses: 1200.56, profit: 799.44 });
    expect(report.monthly).toHaveLength(6);

    const { body: ledger } = await api().get(`/api/finance/ledger?month=${month}`).set(auth).expect(200);
    expect(ledger).toHaveLength(2);

    await api().delete(`/api/finance/transactions/${expense.id}`).set(auth).expect(204);
    const { body: after } = await api().get(`/api/finance/ledger?month=${month}`).set(auth).expect(200);
    expect(after).toHaveLength(1);
  });

  it("validates categories, amounts and dates", async () => {
    const { auth } = await createAccount();
    const valid = { type: "EXPENSE", category: "Aluguel", description: "Aluguel", amount: 10, date: "2026-01-10" };
    await api().post("/api/finance/transactions").set(auth).send({ ...valid, category: "Inventada" }).expect(400);
    await api().post("/api/finance/transactions").set(auth).send({ ...valid, amount: -1 }).expect(400);
    await api().post("/api/finance/transactions").set(auth).send({ ...valid, date: "2999-01-01" }).expect(400);
    await api().get("/api/finance/report?month=2026-13").set(auth).expect(400);
  });
});
