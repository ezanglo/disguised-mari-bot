import { Header } from "@/components/admin/header";
import { Sidebar } from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";

type AdminLayoutProps = {
	children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	return (
		<div className={cn(
			"grid h-screen w-full md:pl-[250px]",
			"transition-[padding] duration-300"
		)}>
			<Sidebar/>
			<div className="flex flex-col w-full overflow-hidden">
				<Header/>
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-5 bg-muted/40 overflow-scroll">
					{children}
				</main>
			</div>
		</div>
	)
}