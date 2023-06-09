type TimeStamp = {
    seconds: number, nanoseconds: number
}
export interface IBase {
    id: React.Key,
    updateAt: TimeStamp | Date,
    createAt: TimeStamp | Date,
    isDeleted: boolean
}