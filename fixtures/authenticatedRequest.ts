import { APIRequestContext } from "@playwright/test";
const getHash = (username: string, password: string) => Buffer.from(`${username}:${password}`).toString('base64')
export class AuthenticatedRequest {
    constructor(public request: APIRequestContext, public username: string, public password: string){}

    async post<T>(url: string, body: T) {
        return await this.request.post(url, {
            data: body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${getHash(this.username, this.password)}`
            }
        })
        console.log(`${getHash(this.username,this.password)}`)
    }
}