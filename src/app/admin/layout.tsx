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
		<div className="flex h-screen w-full overflow-hidden">
			<Sidebar user={user} />
			<div className="flex flex-col flex-1 w-full md:ml-52 lg:ml-72 2xl:ml-96">
				<Header />
				<main className="flex-1 p-4 pt-16 max-w-5xl overflow-hidden">
					{children}
				</main>
			</div>
		</div>
	)
}