import { DataTable } from '@/components/tables/dataTable'
import { API_QUERY_KEY, DATABASE_KEY } from '@/lib/utils'
import { useGetListDoc } from '@/services/hookBase.service'
import { IClass } from '@/typedefs/IClass'
import CreateModal from './CreateModal'
import { columns } from './columns'

// type Props = {}

export default function ClassRoom() {
    const { data, isLoading } = useGetListDoc({ queryKey: API_QUERY_KEY.GET_LIST_CLASSROOM, dbKey: DATABASE_KEY.CLASS })
    return (
        <section className=''>
            <div className='float-left mt-4'>
                <CreateModal />
            </div>
            {data && !isLoading &&
                <DataTable columns={columns} data={data as IClass[]} tableName='classroom' />
            }
        </section>
    )
}