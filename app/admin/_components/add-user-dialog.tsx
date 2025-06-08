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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createUser, updateUser } from "../_actions/users"
import { toast } from "sonner"
import { User } from "@/db/schema/users-schema"

const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2),
  password: z.string().min(6).optional(),
  role: z.enum(["admin", "operator"]),
})

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserAdded: () => void
  user?: User
}

export default function AddUserDialog({
  open,
  onOpenChange,
  onUserAdded,
  user,
}: AddUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = !!user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      username: user?.username || "",
      password: "",
      role: user?.role || "operator",
    },
  })

  // Reset form values when user or open changes
  useEffect(() => {
    if (open) {
      form.reset({
        email: user?.email || "",
        username: user?.username || "",
        password: "",
        role: user?.role || "operator",
      })
    }
  }, [user, open, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append("email", values.email)
      formData.append("username", values.username)
      formData.append("role", values.role)
      if (values.password) {
        formData.append("password", values.password)
      }
      if (isEditMode && user) {
        formData.append("id", user.id)
        const result = await updateUser(formData)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("User updated successfully")
      } else {
        if (!values.password) {
          toast.error("Password is required for new users")
          return
        }
        const result = await createUser(formData)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("User created successfully")
      }
      form.reset()
      onOpenChange(false)
      onUserAdded()
    } catch {
      toast.error("Failed to save user")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the user details below."
              : "Add a new user to the system. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="john.doe@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="john.doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password {isEditMode && "(leave blank to keep current)"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update User"
                  : "Add User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 