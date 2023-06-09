import { API_QUERY_KEY, DATABASE_KEY } from "@/lib/utils"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import fireBaseService from "./fireBase.service"
import { toast } from "@/components/use-toast"
import { IStudent } from "@/typedefs/IStudent"

export function useGetListStudent() {
    return useQuery({
        queryKey: [API_QUERY_KEY.GET_LIST_STUDENT],
        queryFn: () => fireBaseService.getListDocs({ key: DATABASE_KEY.STUDENT }),
    })
}
export function useCreateStudent(queryClient: QueryClient, successHandler?: () => void) {
    return useMutation({
        mutationFn: (data: Partial<IStudent>) => fireBaseService.createDoc(DATABASE_KEY.STUDENT, data),
        onSuccess: () => {
            successHandler && successHandler()
            queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_LIST_STUDENT] })
            toast({
                variant: "success",
                title: "Hooh ray ! Tạo mới thành công",
            })
        }
    })
}
export function useUpdateStudent(queryClient: QueryClient, successHandler?: () => void) {
    return useMutation({
        mutationFn: (data: Partial<IStudent>) => fireBaseService.updateDocument(DATABASE_KEY.STUDENT + '/' + data.id, data),
        onSuccess: () => {
            successHandler && successHandler()
            queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_LIST_STUDENT] })
            toast({
                variant: "success",
                title: "Hooh ray ! Cập nhật thành công",
            })
        }
    })
}
export function useDeleteStudent(queryClient: QueryClient, successHandler?: () => void) {
    return useMutation({
        mutationFn: (id: React.Key) => fireBaseService.deleteDocument(DATABASE_KEY.STUDENT + '/' + id),
        onSuccess: () => {
            successHandler && successHandler()
            queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_LIST_STUDENT] })
            toast({
                variant: "success",
                title: "Hooh ray ! Xóa học sinh thành công",
            })
        }
    })
}
export function useActiveStudent(queryClient: QueryClient, successHandler?: () => void) {
    return useMutation({
        mutationFn: (data: Partial<IStudent>) => fireBaseService.updateDocument(DATABASE_KEY.STUDENT + '/' + data.id, { ...data, status: !data.status }),
        onSuccess: () => {
            successHandler && successHandler()
            queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_LIST_STUDENT] })
            toast({
                variant: "success",
                title: "Hooh ray ! Cập nhật thành công",
            })
        }
    })
}