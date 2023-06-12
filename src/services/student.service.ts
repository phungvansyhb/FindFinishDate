import { API_QUERY_KEY, DATABASE_KEY } from "@/lib/utils";
import fireBaseService from "./fireBase.service";
import { useQuery } from "@tanstack/react-query";

export function useGetListStudent() {
    return useQuery({
        queryKey: [API_QUERY_KEY.GET_LIST_STUDENT],
        queryFn: () => fireBaseService.getListStudentDocs(),
    })
}