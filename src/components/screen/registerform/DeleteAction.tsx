import { DropdownMenuItem } from "@/components/dropdown-menu"
import { API_QUERY_KEY, DATABASE_KEY } from "@/lib/utils"
import { useDeleteDoc } from "@/services/hookBase.service"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"

export default function DeleteAction({ id }: { id: React.Key }) {
    const queryClient = useQueryClient()
    const deleteMutation = useDeleteDoc({ queryClient, dbKey: DATABASE_KEY.REGISTER_FORM, invalidateQueryKey: API_QUERY_KEY.GET_LIST_REGISTERFORM })
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