import { API_QUERY_KEY, DATABASE_KEY } from '@/lib/utils'
import { useActiveDoc } from '@/services/hookBase.service'
import { IRegisterForm } from '@/typedefs/IRegisterForm'
import { useQueryClient } from '@tanstack/react-query'

type Props = { row: IRegisterForm }

export default function ActiveAction({ row }: Props) {
    const queryClient = useQueryClient()
    const useActiveMutation = useActiveDoc({ queryClient: queryClient, dbKey: DATABASE_KEY.REGISTER_FORM, invalidateQueryKey: API_QUERY_KEY.GET_LIST_REGISTERFORM })
    return <input type='checkbox' checked={row.status} onChange={() => useActiveMutation.mutate(row)} />
}