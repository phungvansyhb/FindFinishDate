import { Button } from "@/components/button"
import { API_QUERY_KEY, DATABASE_KEY } from "@/lib/utils"
import { useDeleteDoc } from "@/services/hookBase.service"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"

export default function DeleteAction({ id }: { id: React.Key }) {
    const queryClient = useQueryClient()
    const deleteMutation = useDeleteDoc({ queryClient, dbKey: DATABASE_KEY.CLASS, invalidateQueryKey: API_QUERY_KEY.GET_LIST_CLASSROOM })
    return (
        <Button
            variant={'secondary'}
            onClick={() => deleteMutation.mutate(id)}
        >
            <div className="flex items-center gap-2 cursor-pointer">

                <Trash2Icon size={18} />
            </div>
        </Button>
    )
}