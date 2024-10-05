"use client";

import { useState } from 'react';
import { HeroType } from './heroes-table';
import { Button } from '@/components/ui/button';
import { DEFAULT_IMAGE } from '@/constants/constants';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { updateHero } from '@/actions/hero';
import { ExclusiveWeaponSelect } from '@/components/exclusive-weapon-select';

type HeroWeaponProps = {
	hero: HeroType & {
		exclusiveWeaponImage?: string | null;
	}
}

export default function HeroWeapon({
	hero
}: HeroWeaponProps) {

	const [loading, setLoading] = useState(false)

	const handleSelect = async(val?: string) => {
		try {
			setLoading(true)
			const result = await updateHero({
				id: hero.id,
				exclusiveWeapon: val,
			});
			if (result) {
				toast.success("Hero weapon updated")
			}
		} catch (error) {
			toast.error((error as Error).message)
		} finally {
			setLoading(false)
		}
	}
	
	return (
		<ExclusiveWeaponSelect
			value={hero.exclusiveWeapon || ''} 
			onValueChange={handleSelect}
			classType={hero.classType}
		>
			<Button variant="outline" className="size-12 p-0" disabled={loading}>
				{loading ? <Loader2Icon className="size-4 animate-spin" /> : 
				hero.exclusiveWeaponImage ? (
					<Image
						src={hero.exclusiveWeaponImage || DEFAULT_IMAGE}
						className="size-12 rounded-lg"
						alt={hero.displayName} width={500} height={500}
					/>
				) : (
					<PlusIcon className="size-3" />
				)}
			</Button>
		</ExclusiveWeaponSelect>
	)
}
