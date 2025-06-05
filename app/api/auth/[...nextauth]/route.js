import connectMongo from "@/lib/connectMongo";
import User from "@/models/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const runtime = "nodejs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectMongo();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const username = user.email.split("@")[0];
          const cleaned = username.replace(/[0-9]/g, "").replace(/\s+/g, "");
          const firstName = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
          const newUser = await User.create({
            email: user.email,
            username,
            firstName
          });
        }

        return true;
      } catch (err) {
        console.error("Error in signIn callback:", err);
        return false;
      }
    },
  },
  async redirect({ url, baseUrl }) {
    return baseUrl;
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
