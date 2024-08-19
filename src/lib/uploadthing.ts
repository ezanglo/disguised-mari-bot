import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers, generateUploadButton, generateUploadDropzone, } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } =
	generateReactHelpers<OurFileRouter>();

export const UploadThingButton = generateUploadButton<OurFileRouter>();
export const UploadThingDropzone = generateUploadDropzone<OurFileRouter>();