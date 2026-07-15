import type { Auth, User } from "./prisma.types"

export type ExpressUser = {
  user: User,
  auth: Auth
}
