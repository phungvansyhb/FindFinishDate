import { API_QUERY_KEY, DATABASE_KEY } from '@/lib/utils'
import { useActiveDoc } from '@/services/hookBase.service'
import { IClass } from '@/typedefs/IClass'
import { useQueryClient } from '@tanstack/react-query'

type Props = { row: IClass }

export default function ActiveAction({ row }: Props) {
    const queryClient = useQueryClient()
    const useActiveMutation = useActiveDoc({ queryClient: queryClient, dbKey: DATABASE_KEY.STUDENT, invalidateQueryKey: API_QUERY_KEY.GET_LIST_STUDENT })
    return <input type='checkbox' checked={row.status} onChange={() => useActiveMutation.mutate(row)} />
}