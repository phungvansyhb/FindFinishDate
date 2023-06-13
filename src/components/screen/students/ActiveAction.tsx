import { API_QUERY_KEY, DATABASE_KEY } from '@/lib/utils'
import { useActiveDoc } from '@/services/hookBase.service'
import { IStudent } from '@/typedefs/IStudent'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/dialog'

type Props = { row: IStudent }

export default function ActiveAction({ row }: Props) {
    const queryClient = useQueryClient()
    const useActiveMutation = useActiveDoc({ queryClient: queryClient, dbKey: DATABASE_KEY.STUDENT, invalidateQueryKey: API_QUERY_KEY.GET_LIST_STUDENT })
    return (<Dialog>
        <DialogTrigger asChild>
            <input
                className="ml-6"
                type="checkbox"
                checked={row.status}
                onChange={() => undefined}
            />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogDescription>
                    Hãy chắc chắn với quyết định của mình!
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogTrigger onClick={() => useActiveMutation.mutate(row)} type="submit">
                    Lưu thay đổi
                </DialogTrigger>
            </DialogFooter>
        </DialogContent>
    </Dialog>)
}