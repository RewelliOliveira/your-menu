import { env } from "../../config/env";
import { insertZones } from "../../repositories/delivery-zone-repository";
import { insertCategory, insertDish } from "../../repositories/menu-repository";
import { insertOrders } from "../../repositories/order-repository";
import { insertRestaurant, replaceBusinessHours, saveAddress } from "../../repositories/restaurant-repository";
import { insertTransactions } from "../../repositories/transaction-repository";
import { createUser, findUserByEmail } from "../../repositories/user-repository";
import { hashPassword } from "../../utils/password";
import type { DB } from "../connection";
import { DEMO_ADDRESS, DEMO_CATEGORIES, DEMO_DISHES, DEMO_HOURS, DEMO_RESTAURANT, DEMO_ZONES } from "./demo-catalog";
import { createDemoHistory } from "./demo-history";

export async function seedDemo(db: DB) {
  if (await findUserByEmail(env.DEMO_EMAIL, db)) return;

  const passwordHash = await hashPassword(env.DEMO_PASSWORD);
  const { orders, transactions } = createDemoHistory();

  await db.transaction().execute(async (trx) => {
    const user = await createUser({ name: "Conta Demo", email: env.DEMO_EMAIL, passwordHash }, trx);
    await insertRestaurant(user.id, DEMO_RESTAURANT, trx);
    await saveAddress(DEMO_RESTAURANT.id, DEMO_ADDRESS, trx);
    await replaceBusinessHours(DEMO_RESTAURANT.id, DEMO_HOURS, trx);
    await insertZones(DEMO_RESTAURANT.id, DEMO_ZONES, trx);
    for (const category of DEMO_CATEGORIES) await insertCategory(DEMO_RESTAURANT.id, category, trx);
    for (const dish of DEMO_DISHES) await insertDish(DEMO_RESTAURANT.id, dish, trx);
    await insertOrders(orders, trx);
    await insertTransactions(DEMO_RESTAURANT.id, transactions, trx);
  });
}
