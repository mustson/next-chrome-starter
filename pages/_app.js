import Footer from "../components/Footer";
import Header from "../components/Header";
import LoginButton from "../components/Login";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	return (
		<>
			<SessionProvider session={session}>
				<Header />
				<LoginButton />
				<Component {...pageProps} />
				<Footer />
			</SessionProvider>
		</>
	);
}
