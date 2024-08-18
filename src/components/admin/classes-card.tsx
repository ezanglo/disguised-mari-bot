import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ClassesCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Classes</CardTitle>
				<CardDescription>
					Used to identify classes of Heroes, Pets and more.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<Input placeholder="Store Name"/>
				</form>
			</CardContent>
		</Card>
	)
}