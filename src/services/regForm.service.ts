import { API_QUERY_KEY } from "@/lib/utils";
import fireBaseService from "./fireBase.service";
import { useQuery } from "@tanstack/react-query";

export function useGetListRegisterForm() {
    return useQuery({
        queryKey: [API_QUERY_KEY.GET_LIST_REGISTERFORM],
        queryFn: () => fireBaseService.getListRegisterFormDocs(),
    })
}