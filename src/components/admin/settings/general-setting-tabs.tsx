"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AttributeDialog } from "./attribute-dialog";
import { AttributesTable } from "./attributes-table";
import { ClassDialog } from "./class-dialog";
import { ClassesTable } from "./classes-table";
import { TierDialog } from "./tier-dialog";
import { TiersTable } from "./tiers-table";

export default function GeneralSettingTabs() {
  const [tab, setTab] = useState<string>('tier');

  const AddDialog = tab === 'tier' ? TierDialog : tab === 'class' ? ClassDialog : AttributeDialog;

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="w-full flex gap-2 items-center flex-wrap justify-between">
        <TabsList>
          <TabsTrigger value="tier">Tier</TabsTrigger>
          <TabsTrigger value="class">Class</TabsTrigger>
          <TabsTrigger value="attr">Attribute</TabsTrigger>
        </TabsList>
        <AddDialog>
          <Button variant="outline" size="icon" className="size-8">
            <PlusIcon className="size-4" />
          </Button>
        </AddDialog>
      </div>
      <TabsContent value="tier">
        <TiersTable />
      </TabsContent>
      <TabsContent value="class">
        <ClassesTable />
      </TabsContent>
      <TabsContent value="attr">
        <AttributesTable />
      </TabsContent>
    </Tabs>
  )
}
