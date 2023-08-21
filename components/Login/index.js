import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image'
export default function LoginButton() {
	const { data: session } = useSession();
	if (session) {
		return (
			<>
				{/* Signed in as {session.user.name} <br />
				UserID is as {session.user.id} <br /> */}
				{/* User ID ´{session.user.id}´ <br /> */}
				{/* <Image src="`${session.user.image}`" width={100} height={100}/><br /> */}
				<button onClick={() => signOut()}>Sign out</button>
			</>
		);
	}
	return (
		<>
			Not signed in <br />
			{/* <button onClick={() => signIn()}>Sign in</button> */}
			<button  onClick={() => signIn('twitter',{ callbackUrl: 'http://localhost:3000'})} className="cursor-pointer">
      Sign Inu
    </button>
		</>
	);
}
