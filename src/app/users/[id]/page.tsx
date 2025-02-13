import "./style.css";
import { Mail, Sheet, Users as UsersLogo } from "lucide-react";

import { HomeLayout } from "@/layouts/Home";
import { Body } from "@/layouts/Home/Body";
import { IndexBar } from "@/layouts/Home/Body/IndexBar";
import { Content } from "@/layouts/Home/Body/Content";

import { Goto } from "@/components/Goto";
import { User } from "./_components/User";

export default function Page({ params }: { params: {id: string} }) {
    console.log(params)
    return (
        <HomeLayout>
			<Body>
				<IndexBar>
					<Goto href="/whitelist"><div className="items"><Mail width={20} height={20} /> Whitelist Emails </div></Goto>
					<Goto href="/users"><div className="items"><UsersLogo width={20} height={20} /> Users </div></Goto>
					<Goto href="/tables"><div className="items"><Sheet width={20} height={20} /> Tables </div></Goto>
				</IndexBar>
				<Content>
                    <User url={`${process.env.BACKEND_URL}`} id={params.id} />
				</Content>
			</Body>
		</HomeLayout>
    )
}