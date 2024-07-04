import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Spotify from "next-auth/providers/spotify";
import prisma from "../lib/prisma";

export const authOptions = {
  providers: [
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    session({ session, token, user }) {
      console.log("session", { session, token, user });
      if (token.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
        };
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.account = account;
      }
      return token;
    },
  },
  events: {
    async signIn(message) {
      console.log("signIn", JSON.stringify(message, null, 2));
      const result = await prisma.user.upsert({
        where: {
          spotifyUserId: message.user.id,
        },
        create: {
          spotifyUserId: message.user.id,
        },
        update: {},
      });
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function getServerAuthSession(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  // console.log("getServerAuthSession", args);
  return getServerSession(...args, authOptions);
}

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }
}
