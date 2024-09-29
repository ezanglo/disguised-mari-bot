"use client";

import { deleteListGroup, insertListGroup, updateListGroup } from "@/actions/list";
import { ListGroupType } from "@/components/lists-selector";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PlusIcon, SettingsIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ManageListGroupProps = {
	data: ListGroupType[],
}

export function ManageListGroup({
	data
}: ManageListGroupProps) {
	
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [editing, setEditing] = useState<ListGroupType | undefined>();
	
	const handleInsert = async () => {
		try {
			const result = await insertListGroup(name);
			
			if (result) {
				toast.success(`${name} successfully added.`)
				setName('')
			}
		} catch (error) {
			toast.error((error as Error).message)
		}
	}
	
	const handleDelete = async (item: ListGroupType) => {
		try {
			const result = await deleteListGroup(item.id);
			if (result) {
				toast.success(`${item.name} successfully deleted.`)
				setName('')
			}
		} catch (error) {
			toast.error((error as Error).message)
		}
	}
	
	const handleUpdate = async (item: ListGroupType) => {
		try {
			const existing = data.find(i => i.id === item.id);
			if(existing?.name === item.name) {
				setEditing(undefined)
				return;
			}
			
			const result = await updateListGroup(item.id, item.name);
			if (result) {
				toast.success(`${existing?.name} successfully updated to ${item.name}.`)
				setEditing(undefined)
			}
		} catch (error) {
			toast.error((error as Error).message)
		}
	}
	
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" className="size-8">
					<SettingsIcon className="size-4"/>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Manage List Groups</DialogTitle>
					<DialogDescription>
						Changes will be applied after submitting.
					</DialogDescription>
					<div className="flex gap-2">
						<Input
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder="Add a list group..."
							className="flex-1"
						/>
						<Button
							variant="secondary"
							size="icon"
							onClick={handleInsert}
						>
							<PlusIcon className="size-4"/>
						</Button>
					</div>
					<div className="border border-muted rounded">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead className="text-center w-[25px]">Items</TableHead>
									<TableHead className="w-[50px]">
										<span className="sr-only">Actions</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((item, index) => (
									<TableRow key={index}>
										<TableCell
											className={cn("text-start")}
											onClick={() => setEditing(item)}
										>
											<div className="inline-flex items-center">
												<span
													className={cn(editing?.id === item.id && 'hidden')}
												>
													{item.name}
												</span>
												{editing?.id === item.id && (
													<Input
														className="border-none focus:ring-none focus:outline-none w-auto"
														value={editing?.name}
														onChange={e => setEditing(prev => prev &&
															({...prev, name: e.target.value})
														)}
														onBlur={() => handleUpdate(editing)}
														onKeyDown={async (event) => {
															if (event.key === 'Enter') {
																await handleUpdate(editing)
															}
														}}
														autoFocus
													/>
												)}
											</div>
										</TableCell>
										<TableCell className="text-center">
											{item.itemCount}
										</TableCell>
										<TableCell className="text-right">
											{item.itemCount === 0 && (
												<ConfirmDialog
													title={`Delete ${item.name}?`}
													description="This action is permanent and cannot be undone."
													onConfirm={() => handleDelete(item)}
												>
													<Button variant="ghost" size="icon" className="hover:bg-transparent p-0 size-4">
														<XIcon className="size-4 text-destructive"/>
													</Button>
												</ConfirmDialog>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}