import { test as base } from '@playwright/test'
import { AuthenticatedRequest } from './authenticatedRequest'
import {randomUUID} from 'crypto'
import { createUser } from '../util/user'

export const test = base.extend<{ authenticatedRequest: AuthenticatedRequest }>({
    authenticatedRequest: async ({ request }, use) => {
        const unique= randomUUID();
        const {status,body}= await createUser(request,{username:unique,password:unique})
        console.log('Before Test')
        const ar = new AuthenticatedRequest(request,unique,unique);
        await use(ar)
        console.log('After test')
    }
})