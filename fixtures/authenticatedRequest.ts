// import { APIRequestContext } from "@playwright/test";
// const getHash = (username: string, password: string) => Buffer.from(`${username}:${password}`).toString('base64')
// export class AuthenticatedRequest {
//     constructor(public request: APIRequestContext, public username: string, public password: string){}

//     async post<T>(url: string, body: T) {
//         return await this.request.post(url, {
//             data: body,
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Basic ${getHash(this.username, this.password)}`
//             }
//         })
//         console.log(`${getHash(this.username,this.password)}`)
//     }
// }

import { APIRequestContext } from "playwright-core";
export const getHash = (username:string,password:string)=>Buffer.from(`${username}:${password}`).toString('base64')
export class AuthenticatedRequest{
    constructor(public request:APIRequestContext, public username:string, public password:string){}
    async post<T>(url:string,body:T){
        return await this.request.post(url,{
            data:body,
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Basic ${getHash(this.username,this.password)}`
            }
        })
    }

    async delete<T>(url:string){
        return await this.request.delete(url,{
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Basic ${getHash(this.username,this.password)}`
            }
        })
    }

    async put<T>(url:string,body:T){
        return await this.request.put(url,{
            data:body,
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Basic ${getHash(this.username,this.password)}`
            }
        })
    }

    async patch<T>(url:string,body:T){
        return await this.request.patch(url,{
            data:body,
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Basic ${getHash(this.username,this.password)}`
            }
        })
    }
    async get<T>(url:string){
        return await this.request.get(url,{
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Basic ${getHash(this.username,this.password)}`
            }
        })
    }

    async getAll<T>(url:string){
        return await this.request.get(url,{
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Basic ${getHash(this.username,this.password)}`
            }
        })
    }
}