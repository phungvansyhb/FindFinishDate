import { toast } from "@/components/use-toast";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { IStudent } from './../typedefs/IStudent';
import fireBaseService from "./fireBase.service";



export function useGetListDoc({ queryKey, dbKey, enable = true  , whereClause }: { queryKey: string, dbKey: string, enable?: boolean , whereClause? :[string, '==' | '!=', any][]  }) {
    return useQuery({
        queryKey: [queryKey],
        queryFn: () => fireBaseService.getListDocs({ key: dbKey , whereClause }),
        enabled: enable
    })
}
export function useGetDetailDoc({ queryKey, dbKey, enable = true  }: { queryKey: string, dbKey: string, enable?: boolean }) {
    return useQuery({
        queryKey: [queryKey],
        queryFn: () => fireBaseService.getDetailDoc(dbKey),
        enabled: enable,
    })
}
export function useCreateDoc({ queryClient, successHandler, invalidateQueryKey, dbKey }: { queryClient: QueryClient, successHandler?: () => void, invalidateQueryKey: string[], dbKey: string }) {
    return useMutation({
        mutationFn: (data: Partial<IStudent>) => fireBaseService.createDoc(dbKey, data),
        onSuccess: () => {
            successHandler && successHandler()
            queryClient.invalidateQueries({ queryKey: invalidateQueryKey })
            toast({
                variant: "success",
                title: "Hooh ray ! Tạo mới thành công",
            })
        }
    })
}
export function useUpdateDoc({ queryClient, successHandler, invalidateQueryKey, dbKey }: { queryClient: QueryClient, successHandler?: () => void, invalidateQueryKey: string[], dbKey: string }) {
    return useMutation({
        mutationFn: (data: Partial<IStudent>) => fireBaseService.updateDocument(dbKey + '/' + data.id, data),
        onSuccess: () => {
            successHandler && successHandler()
            queryClient.invalidateQueries({ queryKey: invalidateQueryKey })
            toast({
                variant: "success",
                title: "Hooh ray ! Cập nhật thành công",
            })
        }
    })
}
export function useDeleteDoc({ queryClient, successHandler, invalidateQueryKey, dbKey }: { queryClient: QueryClient, successHandler?: () => void, invalidateQueryKey: string, dbKey: string }) {
    return useMutation({
        mutationFn: (id: React.Key) => fireBaseService.deleteDocument(dbKey + '/' + id),
        onSuccess: () => {
            successHandler && successHandler()
            queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] })
            toast({
                variant: "success",
                title: "Hooh ray ! Xóa học sinh thành công",
            })
        }
    })
}
export function useActiveDoc({ queryClient, successHandler, invalidateQueryKey, dbKey }: { queryClient: QueryClient, successHandler?: () => void, invalidateQueryKey: string, dbKey: string }) {
    return useMutation({
        mutationFn: (data: Partial<IStudent>) => fireBaseService.updateDocument(dbKey + '/' + data.id, { ...data, status: !data.status }),
        onSuccess: () => {
            successHandler && successHandler()
            queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] })
            toast({
                variant: "success",
                title: "Hooh ray ! Cập nhật thành công",
            })
        }
    })
}