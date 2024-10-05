"use client";

import React, { useState } from 'react'
import { HeroType } from './heroes-table'
import { PetSelect } from '@/components/pet-select'
import { Button } from '@/components/ui/button'
import { DEFAULT_IMAGE } from '@/constants/constants'
import Image from 'next/image'
import { updatePet } from '@/actions/pet'
import { toast } from 'sonner'
import { Loader2Icon, PlusIcon } from 'lucide-react';

type HeroPetProps = {
	hero: HeroType & {
		petCode?: string | null;
		petImage?: string | null;
	}
}

export default function HeroPet({
	hero
}: HeroPetProps) {

	const [loading, setLoading] = useState(false)

	const handleSelect = async(val?: string) => {
		try {
			setLoading(true)
			const result = await updatePet({
				hero: hero.code,
				code: val,
			});
			if (result) {
				toast.success("Hero pet updated")
			}
		} catch (error) {
			toast.error((error as Error).message)
		} finally {
			setLoading(false)
		}
	}
	
	return (
		<PetSelect 
			value={hero.petCode || ''} 
			onValueChange={handleSelect}
		>
			<Button variant="outline" className="size-12 p-0" disabled={loading}>
				{loading ? <Loader2Icon className="size-4 animate-spin" /> : 
				hero.petCode ? (
					<Image
						src={hero.petImage || DEFAULT_IMAGE}
						className="size-12 rounded-lg"
						alt={hero.displayName} width={500} height={500}
					/>
				) : (
					<div className="flex flex-col items-center text-xs">
						 <PlusIcon className="size-3" />
						 <span>Pet</span>
					</div>
				)}
			</Button>
		</PetSelect>
	)
}
