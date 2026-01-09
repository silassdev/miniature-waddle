import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"


export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
    // maxAge, updateAge can be tuned if needed
  },
  pages: {
    // Optional custom pages:
    // signIn: '/auth/signin',
    // error: '/auth/error'
  },
  callbacks: {
    // Include the DB user id in the session returned to the client
    async session({ session, user }) {
      if (session.user) {
        // attach database user id and any other DB fields you want available client-side
        session.user.id = user.id
        // Example: if your user doc has "role" or "preferences", you can attach them here:
        // session.user.role = (user as any).role ?? 'user'
      }
      return session
    },

    // Optional: control signIn behavior (return true to allow)
    async signIn({ user, account, profile, email, credentials }) {
      // Example: restrict by domain:
      // const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN
      // if (allowedDomain && email?.endsWith(`@${allowedDomain}`) === false) return false
      return true
    },
  },

  // Helpful debugging option (disable in production)
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
