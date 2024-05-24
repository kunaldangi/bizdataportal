import "./style.css";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Mail, Users, Sheet } from 'lucide-react';

import verifyToken from "@/lib/jwt";

import { HomeLayout } from "@/layouts/Home";
import { Body } from "@/layouts/Home/Body";
import { IndexBar } from "@/layouts/Home/Body/IndexBar";
import { Content } from "@/layouts/Home/Body/Content";
import Image from "next/image";


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
					<div className="items"><Mail width={20} height={20} /> Whitelist Emails </div>
					<div className="items"><Users width={20} height={20} /> Users  </div>
					<div className="items"><Sheet width={20} height={20} /> Tables  </div>
				</IndexBar>
				<Content>
					<div className="content">
						<div className="content__logo">
							<Image src="/biz-logo.png" alt="logo" width={150} height={150} />
						</div>
						<div className="content__title">
							<span>Biz Data Portal</span>
						</div>
						<div className="content__dashboard">
							
						</div>
					</div>
				</Content>
			</Body>
		</HomeLayout>
	);
}
