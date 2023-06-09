import { DropdownMenuItem } from "@/components/dropdown-menu"
import { useDeleteStudent } from "@/services/student.service"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"

export default function DeleteAction({ id }: { id: React.Key }) {
    const queryClient = useQueryClient()
    const deleteMutation = useDeleteStudent(queryClient)
    return (
        <DropdownMenuItem
            onClick={() => deleteMutation.mutate(id)}
        >
            <div className="flex items-center gap-2 cursor-pointer">

                <Trash2Icon size={18} /> Delete
            </div>
        </DropdownMenuItem>
    )
}