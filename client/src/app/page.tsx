import verifyToken from "@/lib/jwt";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
	try {	
		const cookieStore = cookies();
		const session: any = cookieStore.get("session")?.value;
		if(!session) {
			redirect("/auth/login");
		}
	 	await verifyToken(session, process.env.JWT_SESSION_SECRET || '');
	} catch (error) {
		console.log(error);
		redirect("/auth/login");
	}
	return (
		<div>Hello World</div>
	);
}
