import { api } from "./api";

export const addClass = (data:object)=>api.post('/class/addclass' , data)
export const allClasses = ()=>api.post('/class/allclasses')