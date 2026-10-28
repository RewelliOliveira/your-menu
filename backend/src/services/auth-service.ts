import { db } from "../database/connection";
import { WEEKDAYS } from "../domain/business-hours";
import { slugify } from "../domain/text";
import { AppError, ConflictError, UnauthorizedError } from "../errors/app-error";
import { findRestaurantByOwner, insertRestaurant, replaceBusinessHours, slugExists } from "../repositories/restaurant-repository";
import { createUser, findUserByEmail, findUserById, toUser } from "../repositories/user-repository";
import type { Session, User } from "../types/auth";
import { createId } from "../utils/id";
import { hashPassword, verifyPassword } from "../utils/password";
import { signToken } from "../utils/token";
import type { LoginInput, RegisterInput } from "../validators/auth-validators";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESERVED_SLUGS = new Set(["admin", "api", "login", "register"]);

function normalizeCredentials({ email, password }: LoginInput) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalizedEmail)) throw new AppError("Informe um e-mail válido.");
  if (password.length < 8) throw new AppError("A senha deve ter pelo menos 8 caracteres.");
  return { email: normalizedEmail, password };
}

async function generateSlug(restaurantName: string) {
  const base = slugify(restaurantName) || "restaurante";
  let slug = base;
  for (let suffix = 2; RESERVED_SLUGS.has(slug) || (await slugExists(slug)); suffix++) slug = `${base}-${suffix}`;
  return slug;
}

function createSession(user: User, restaurantId: string): Session {
  const { token, expiresAt } = signToken({ userId: user.id, restaurantId });
  return { token, expiresAt, restaurantId, user };
}

export async function register(input: RegisterInput) {
  const { email, password } = normalizeCredentials(input);
  const name = input.name.trim().replace(/\s+/g, " ");
  const restaurantName = input.restaurantName.trim();
  if (name.split(" ").length < 2) throw new AppError("Informe nome e sobrenome.");
  if (restaurantName.length < 2 || restaurantName.length > 60) {
    throw new AppError("O nome do restaurante deve ter entre 2 e 60 caracteres.");
  }
  if (await findUserByEmail(email)) throw new ConflictError("Já existe uma conta com esse e-mail.");

  const passwordHash = await hashPassword(password);
  const slug = await generateSlug(restaurantName);
  const restaurantId = createId();

  const user = await db.transaction().execute(async (trx) => {
    const created = await createUser({ name, email, passwordHash }, trx);
    await insertRestaurant(
      created.id,
      {
        id: restaurantId,
        slug,
        name: restaurantName,
        description: "",
        logoUrl: null,
        bannerUrl: null,
        deliveryTimeMin: 30,
        deliveryTimeMax: 45,
        isOpen: false,
        pickupEnabled: true,
        pixKey: "",
      },
      trx,
    );
    await replaceBusinessHours(
      restaurantId,
      WEEKDAYS.map((weekday) => ({ weekday, isOpen: true, openingTime: "18:00", closingTime: "23:00" })),
      trx,
    );
    return created;
  });

  return createSession(toUser(user), restaurantId);
}

export async function login(input: LoginInput) {
  const { email, password } = normalizeCredentials(input);
  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new AppError("E-mail ou senha incorretos.", 401);
  }
  const restaurant = await findRestaurantByOwner(user.id);
  if (!restaurant) throw new UnauthorizedError("Nenhum restaurante vinculado a esta conta.");
  return createSession(toUser(user), restaurant.id);
}

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new UnauthorizedError();
  return toUser(user);
}
