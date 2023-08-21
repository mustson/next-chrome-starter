import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

const authOptions = {
  providers: [
    TwitterProvider({
      clientId: "c3lPaXU1RVpRN2E1cldVNnZUX0w6MTpjaQ",
      clientSecret: "MgjjMRmx78mtH-siiZYpc_5TdLPPhZAHWV_Mf2ttIHlPuR8jXT",
	  version: "2.0",
    }),
  ],
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      console.log('JWT callback', token, user, account, profile, isNewUser);
      if (user) {
        token.userId = user.id; // Or another identifier from the user object
      }
      return token;
    },
    async session(session, token) {
      console.log('Session callback', token);
      if (token && token.userId) {
        session.userId = token.userId;
      }
      return session;
    },
  },
  
}

export default NextAuth(authOptions)
