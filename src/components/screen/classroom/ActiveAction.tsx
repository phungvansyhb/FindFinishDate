import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/dialog'
import { API_QUERY_KEY, DATABASE_KEY } from '@/lib/utils'
import { useActiveDoc } from '@/services/hookBase.service'
import { IClass } from '@/typedefs/IClass'
import { useQueryClient } from '@tanstack/react-query'

type Props = { row: IClass }

export default function ActiveAction({ row }: Props) {
    const queryClient = useQueryClient()
    const useActiveMutation = useActiveDoc({ queryClient: queryClient, dbKey: DATABASE_KEY.CLASS, invalidateQueryKey: API_QUERY_KEY.GET_LIST_CLASSROOM })
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