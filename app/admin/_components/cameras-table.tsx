"use client"

import { useState, useEffect } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Camera } from "@/db/schema/cameras-schema"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import AddCameraDialog from "@/app/admin/_components/add-camera-dialog"
import { getCameras, deleteCamera } from "../_actions/cameras"

const columns: ColumnDef<Camera>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "streamUrl",
    header: "Stream URL",
    cell: ({ row }) => {
      const url = row.getValue("streamUrl") as string
      return url.length > 30 ? `${url.substring(0, 30)}...` : url
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      return row.getValue("active") ? "Active" : "Inactive"
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
]

function TableSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export function CamerasTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [cameras, setCameras] = useState<Camera[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [cameraToDelete, setCameraToDelete] = useState<Camera | null>(null)
  const [cameraToEdit, setCameraToEdit] = useState<Camera | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const table = useReactTable({
    data: cameras,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  useEffect(() => {
    async function loadCameras() {
      try {
        const camerasList = await getCameras()
        setCameras(camerasList)
      } catch (error) {
        toast.error("Failed to load cameras")
      } finally {
        setIsLoading(false)
      }
    }
    loadCameras()
  }, [])

  const handleDelete = async (camera: Camera) => {
    setCameraToDelete(camera)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!cameraToDelete) return

    try {
      await deleteCamera(cameraToDelete.id)
      setCameras(cameras.filter((c) => c.id !== cameraToDelete.id))
      toast.success("Camera deleted successfully")
    } catch (error) {
      toast.error("Failed to delete camera")
    } finally {
      setIsDeleteDialogOpen(false)
      setCameraToDelete(null)
    }
  }

  const handleEdit = (camera: Camera) => {
    setCameraToEdit(camera)
    setIsAddDialogOpen(true)
  }

  if (isLoading) {
    return <TableSkeleton />
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Cameras</h2>
        <Button className="cursor-pointer" onClick={() => {
          setCameraToEdit(undefined)
          setIsAddDialogOpen(true)
        }}>Add Camera</Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        className="cursor-pointer"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(row.original)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" aria-label="Edit Camera"/>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row.original)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" aria-label="Delete Camera"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No cameras found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <AddCameraDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onCameraAdded={(newCamera: Camera) => {
          setCameras([...cameras, newCamera])
        }}
        onCameraUpdated={(updatedCamera: Camera) => {
          setCameras(cameras.map((c) => 
            c.id === updatedCamera.id ? updatedCamera : c
          ))
        }}
        camera={cameraToEdit}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              camera.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 