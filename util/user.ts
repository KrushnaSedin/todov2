import { APIRequestContext } from "@playwright/test";

export async function createUser(request:APIRequestContext,body:{username:string,password:string}){

    const resp = await request.post('/v2/todo',{
        data: body,
        headers:{
            "Content-Type":"application/json"
        }
    })
    return{status: resp.status(), body:await resp.json()}
}