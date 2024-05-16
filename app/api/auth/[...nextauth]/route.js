import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/mongoDb";
import User from "@/lib/mongo_models/users.model";

async function siginIn(credentials) {
  try {
    await dbConnect();

    const user = await User.findOne({ email: credentials.email });

    if (!user) throw new Error("Invalid Credentials");
    if (user.password !== credentials.password)
      throw new Error("Invalid Credentials");

    return user;
  } catch (error) {
    throw new Error("error while logging in...", error);
  }
}

export const authOptions = {
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          console.log(credentials);

          const user = await siginIn(credentials);
          return user;
        } catch (error) {
          console.log("Something wen wrong..", error);
        }
      },
    }),
  ],

  // callbacks: {
  //     async jwt(token, user){
  //         if(user){
  //             token.id = user._id
  //             token.name = user.firstName
  //             token.email = user.email
  //         }

  //         console.log("token :- ",token)
  //         return token
  //     },
  //     async session(session, user){
  //         if (user) {
  //             session.user = user
  //         }
  //         console.log("session :- ",session)

  //         return session
  //     }
  // }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
