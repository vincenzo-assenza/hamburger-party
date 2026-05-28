// lib/trpc-server.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@example.com';

// === CONTEXT ===
export const createContext = async ({ req }: any) => {
  let user = null;
  const token = req?.headers?.authorization?.replace('Bearer ', '');

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET) as { email: string; name: string };
    } catch (e) {
      // Token invalid
    }
  }

  return { user };
};

const t = initTRPC.context<typeof createContext>().create();

// === PROCEDURES ===
const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated',
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

const ownerProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.email !== OWNER_EMAIL) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only owner can access this',
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// === SCHEMAS ===
const IngredientsSchema = z.object({
  lettuce: z.boolean(),
  tomato: z.boolean(),
  cheese: z.boolean(),
  fries: z.boolean(),
});

// === ROUTERS ===
export const appRouter = t.router({
  orders: t.router({
    create: publicProcedure
      .input(
        z.object({
          friendName: z.string().min(1).max(50),
          ingredients: IngredientsSchema,
          meatDoneness: z.enum(['rare', 'medium', 'well_done']),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await sql`
            INSERT INTO orders (friend_name, ingredients, meat_doneness) 
            VALUES (${input.friendName}, ${JSON.stringify(input.ingredients)}, ${input.meatDoneness})
          `;

          return {
            success: true,
            message: `Ordine di ${input.friendName} salvato! 🍔`,
          };
        } catch (error) {
          console.error('Create order error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to save order',
          });
        }
      }),

    getAll: ownerProcedure.query(async () => {
      try {
        const result = await sql`
          SELECT id, friend_name, ingredients, meat_doneness, created_at 
          FROM orders 
          ORDER BY created_at DESC
        `;

        return result.rows.map((row: any) => ({
          id: row.id,
          friendName: row.friend_name,
          ingredients: JSON.parse(row.ingredients),
          meatDoneness: row.meat_doneness,
          createdAt: row.created_at,
        }));
      } catch (error) {
        console.error('Get orders error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch orders',
        });
      }
    }),

    delete: ownerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          await sql`DELETE FROM orders WHERE id = ${input.id}`;
          return { success: true };
        } catch (error) {
          console.error('Delete order error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete order',
          });
        }
      }),
  }),

  auth: t.router({
    oauthCallback: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string(),
          oauthId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const isOwner = input.email === OWNER_EMAIL;

          await sql`
            INSERT INTO users (email, name, oauth_id, is_owner) 
            VALUES (${input.email}, ${input.name}, ${input.oauthId}, ${isOwner})
            ON CONFLICT (email) DO UPDATE SET name = ${input.name}, oauth_id = ${input.oauthId}
          `;

          const token = jwt.sign(
            { email: input.email, name: input.name },
            JWT_SECRET,
            { expiresIn: '30d' }
          );

          return { token, isOwner };
        } catch (error) {
          console.error('OAuth callback error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Authentication failed',
          });
        }
      }),

    verify: publicProcedure.query(({ ctx }) => {
      return {
        isAuthenticated: !!ctx.user,
        user: ctx.user,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
