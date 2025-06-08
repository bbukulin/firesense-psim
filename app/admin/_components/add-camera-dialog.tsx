"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Camera } from "@/db/schema/cameras-schema"
import { addCamera, updateCamera } from "../_actions/cameras"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  streamUrl: z.string().url("Must be a valid URL"),
})

interface AddCameraDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCameraAdded: (camera: Camera) => void
  onCameraUpdated: (camera: Camera) => void
  camera?: Camera
}

export default function AddCameraDialog({
  open,
  onOpenChange,
  onCameraAdded,
  onCameraUpdated,
  camera,
}: AddCameraDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      streamUrl: "",
    },
  })

  useEffect(() => {
    if (camera) {
      form.reset({
        name: camera.name,
        location: camera.location || "",
        streamUrl: camera.streamUrl,
      })
    } else {
      form.reset({
        name: "",
        location: "",
        streamUrl: "",
      })
    }
  }, [camera, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      if (camera) {
        const updatedCamera = await updateCamera(camera.id, values)
        onCameraUpdated(updatedCamera)
        toast.success("Camera updated successfully")
      } else {
        const newCamera = await addCamera({
          name: values.name,
          location: values.location || null,
          streamUrl: values.streamUrl,
          active: true,
        })
        onCameraAdded(newCamera)
        toast.success("Camera added successfully")
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(camera ? "Failed to update camera" : "Failed to add camera")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{camera ? "Edit Camera" : "Add Camera"}</DialogTitle>
          <DialogDescription>
            {camera
              ? "Update the camera details below."
              : "Add a new camera to the system. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Entrance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Building A - Front Door" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="streamUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/streams/main-entrance"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className="cursor-pointer" type="submit" disabled={isLoading}>
                {isLoading
                  ? camera
                    ? "Updating..."
                    : "Adding..."
                  : camera
                    ? "Update Camera"
                    : "Add Camera"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 