import "./style.css";

import { Mail, Sheet, Users as UsersLogo } from "lucide-react";

import { HomeLayout } from "@/layouts/Home";
import { Body } from "@/layouts/Home/Body";
import { IndexBar } from "@/layouts/Home/Body/IndexBar";
import { Content } from "@/layouts/Home/Body/Content";

import { Goto } from "@/components/Goto";
import { Users } from "./_components/Users";

export default async function Page(){
    return (
		<HomeLayout>
			<Body>
				<IndexBar>
					<Goto href="/whitelist"><div className="items"><Mail width={20} height={20} /> Whitelist Emails </div></Goto>
					<Goto href="/users"><div className="items"><UsersLogo width={20} height={20} /> Users </div></Goto>
					<Goto href="/tables"><div className="items"><Sheet width={20} height={20} /> Tables </div></Goto>
				</IndexBar>
				<Content>
                    <Users url={`${process.env.BACKEND_URL}`} />
				</Content>
			</Body>
		</HomeLayout>
	);
}