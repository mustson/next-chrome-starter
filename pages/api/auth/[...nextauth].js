import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

const authOptions = {
  providers: [
    TwitterProvider({
      clientId: "c3lPaXU1RVpRN2E1cldVNnZUX0w6MTpjaQ",
      clientSecret: "Qa877MLX3ulZWncJ3btAmFsdybgFze7-C2Tq9R2W6cGQsSlKxj",
      version: "2.0",
    }),
  ],
  jwt: {
    secret: "jubeikurosawacyber2077", // Replace with your actual secret key
  },

  session: {
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 years in seconds
  },

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT Token:", token);

      //update user profile collection in db
      if (token) {
        const response = await fetch(`${baseUrl}/api/profiler`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: token.sub,
            isExtensionUser: true, // Replace with actual value
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update user profile");
        }
      }

      return token;
    },
    async session({ session, account, token, user }) {
      console.log("Session:", session);
      console.log("Token:", token);
      console.log("Account:", account);

      if (token) {
        session.token = {
          name: token.name,
          sub: token.sub,
        };
        session.user = {
          id: token.sub,
          name: token.name,
        };
      }

      if (account) {
        session.account = {
          account: account,
        };
        console.log("Account:", account);
      }

      return session;
    },
    /* session: {
      jwt: true,
  }, */
  },
  /* 
  callbacks: {
    async jwt({  profile }) {
      return profile
    },
    async session(session, token) {
      console.log('Session callback', token);
       // Add user information to the session object
    if (profile) {
      session.userId = profile.userId;
      session.userName = profile.userName;
      session.userImage = profile.userImage;
    }
    return session;
    },
  },  */
};

export default NextAuth(authOptions);
