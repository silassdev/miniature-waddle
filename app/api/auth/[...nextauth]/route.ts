import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { User } from "@/models/User.model"
import bcrypt from "bcryptjs"
import dbConnect from "../../../../lib/db"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await dbConnect();

        // Find user by email and explicitly select password
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image
        };
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  pages: {
    // Optional custom pages:
    // signIn: '/auth/signin',
    // error: '/auth/error'
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // attach database user id and any other DB fields you want available client-side
        session.user.id = user.id
      }
      return session
    },

    // Optional: control signIn behavior (return true to allow)
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
  },

  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
