import { useActiveStudent } from '@/services/student.service'
import { IStudent } from '@/typedefs/IStudent'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

type Props = { row: IStudent }

export default function ActiveAction({ row }: Props) {
    const queryClient = useQueryClient()
    const useActiveMutation = useActiveStudent(queryClient)
    return <input type='checkbox' checked={row.status} onChange={() => useActiveMutation.mutate(row)} />
}