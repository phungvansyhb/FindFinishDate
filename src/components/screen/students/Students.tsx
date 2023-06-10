import { useGetListDoc } from '@/services/hookBase.service'
import { IStudent } from '@/typedefs/IStudent'
import { DataTable } from '../../tables/dataTable'
import CreateModal from './CreateModal'
import { columns } from './columns'
import { API_QUERY_KEY, DATABASE_KEY } from '@/lib/utils'


export default function Students() {
    const { data, isLoading } = useGetListDoc({ queryKey: API_QUERY_KEY.GET_LIST_STUDENT, dbKey: DATABASE_KEY.STUDENT })
    return (
        <section className=''>
            <div className='float-left mt-4'>
                <CreateModal />
            </div>
            {data && !isLoading &&
                <DataTable columns={columns} data={data as IStudent[]} tableName='student' />
            }
        </section>
    )
}