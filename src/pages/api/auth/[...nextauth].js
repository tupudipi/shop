import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { db } from '@/firebaseInit';
import { doc, setDoc } from 'firebase/firestore';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        const userDoc = {
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: new Date().toISOString(),
        };
        const docRef = doc(db, 'Users', user.email);
        await setDoc(docRef, userDoc, { merge: true });
      }
      return true;
    },
  },
}

export default NextAuth(authOptions)