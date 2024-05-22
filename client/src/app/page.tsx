import "./style.css";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import verifyToken from "@/lib/jwt";

import { HomeLayout } from "@/layouts/Home";
import { Body } from "@/layouts/Home/Body";
import { IndexBar } from "@/layouts/Home/Body/IndexBar";
import { Content } from "@/layouts/Home/Body/Content";


export default async function Home() {
	try {	
		const cookieStore = cookies();
		const session: any = cookieStore.get("session")?.value;
		if(!session) {
			redirect("/auth/login");
		}
	 	await verifyToken(session, process.env.JWT_SESSION_SECRET || '');
	} catch (error) {
		redirect("/auth/login");
	}
	return (
		<HomeLayout>
			<Body>
				<IndexBar>
					<span>IndexBar</span>
				</IndexBar>
				<Content>
					<span>Content</span>
				</Content>
			</Body>
		</HomeLayout>
	);
}
