import { APIRequestContext } from "@playwright/test";
import { AuthenticatedRequest } from "../fixtures/authenticatedRequest";

export async function createUser(request:APIRequestContext,body:{username:string,password:string}){

    const resp = await request.post('/v2/todo',{
        data: body,
        headers:{
            "Content-Type":"application/json"
        }
    })
    console.log('Created User')
    return{status: resp.status(), body:await resp.json()}
}

export async function deleteMe(authenticatedRequest:AuthenticatedRequest){

    const resp = await authenticatedRequest.delete('/v2/user')
    console.log('Deleted User')
    return resp.status()
}