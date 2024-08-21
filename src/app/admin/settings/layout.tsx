import { SettingsSidebar } from "@/components/admin/settings-sidebar";

type SettingsLayoutProps = {
	children: React.ReactNode;
}

export default function SettingsLayout({children}: SettingsLayoutProps) {
	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen">
			<div className="flex items-center">
				<h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
			</div>
			<div className="flex-1 mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
				<SettingsSidebar/>
				<div className="max-w-6xl">
					{children}
				</div>
			</div>
		</main>
	)
}