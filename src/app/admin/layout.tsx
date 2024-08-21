import { auth } from "@/auth";
import { Header } from "@/components/admin/header";
import { Sidebar } from "@/components/admin/sidebar";

type AdminLayoutProps = {
	children: React.ReactNode;
}

export default async function AdminLayout({children}: AdminLayoutProps) {
	
	const session = await auth();
	const user = session?.user;
	
	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<Sidebar user={user}/>
			<div className="flex flex-col">
				<Header/>
				{children}
			</div>
		</div>
	)
}