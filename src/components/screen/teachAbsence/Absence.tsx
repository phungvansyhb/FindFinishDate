import { useGetListAbsence } from '@/services/absence.service'
import { IAbsenceForm } from '@/typedefs/IAbsenceForm'
import { DataTable } from '../../tables/dataTable'
import CreateModal from './CreateModal'
import { columns } from './columns'


export default function TeachAbsence() {
    const { data, isLoading } = useGetListAbsence()
    return (
        <section className=''>
            <div className='float-left mt-4'>
                <CreateModal />
            </div>
            {data && !isLoading &&
                <DataTable columns={columns} data={data as IAbsenceForm[]} tableName='absence' />
            }
        </section>
    )
}