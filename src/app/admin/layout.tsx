import { Header } from "@/components/admin/header";

type AdminLayoutProps = {
	children: React.ReactNode;
}

export default function AdminLayout({children}: AdminLayoutProps) {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<Header/>
			{children}
		</div>
	)
}