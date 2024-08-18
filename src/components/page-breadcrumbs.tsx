"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function PageBreadcrumbs() {
	const pathname = usePathname();
	const paths = pathname.split("/").filter(Boolean);
	
	const pathLabel = (path: string) => {
		return path
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
	}
	
	const pathUrl = (paths: string[], index: number) => {
		return '/' + paths.slice(0, index + 1).join('/');
	}
	
	// const pathLabel = (paths: string[], index: number) => {
	// 	const url = pathUrl(paths, index);
	//
	// 	const menu = SIDEBAR_MENU.find(item => item.href === url);
	//
	// }
	
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{paths.map((path, index) => (
					<React.Fragment key={index}>
						{index !== 0 && (
							<BreadcrumbSeparator/>
						)}
						{index === paths.length - 1 ? (
							<BreadcrumbItem key={index}>
								<BreadcrumbPage>{pathLabel(path)}</BreadcrumbPage>
							</BreadcrumbItem>
						) : (
							<BreadcrumbItem key={index}>
								<BreadcrumbLink asChild>
									<Link href={pathUrl(paths, index)}>{pathLabel(path)}</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
						)}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}