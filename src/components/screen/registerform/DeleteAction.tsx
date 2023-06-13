import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/dialog"
import { API_QUERY_KEY, DATABASE_KEY } from "@/lib/utils"
import { useDeleteDoc } from "@/services/hookBase.service"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"

export default function DeleteAction({ id }: { id: React.Key }) {
    const queryClient = useQueryClient()
    const deleteMutation = useDeleteDoc({ queryClient, dbKey: DATABASE_KEY.REGISTER_FORM, invalidateQueryKey: API_QUERY_KEY.GET_LIST_REGISTERFORM })
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 ml-2 cursor-pointer">
                    <Trash2Icon size={18} />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Xác nhận</DialogTitle>
                    <DialogDescription>
                        Hãy chắc chắn với quyết định của mình!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogTrigger
                        onClick={() => deleteMutation.mutate(id)}
                        type="submit"
                    >
                        Lưu thay đổi
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}