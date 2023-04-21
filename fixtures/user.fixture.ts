import {test as base,expect} from '@playwright/test'
import { createUser, deleteMe } from '../util/user';
import { AuthenticatedRequest } from './authenticatedRequest'
import { randomUUID } from 'crypto';
export const test = base.extend<{authenticatedRequest:AuthenticatedRequest}>({
    authenticatedRequest: async ({request},use)=>{
        const unique = randomUUID();
        const {status} = await createUser(request,{username:unique,password:unique})
        expect(status).toBe(201)
        const ar = new AuthenticatedRequest(request,unique,unique);
        await use(ar)
        await deleteMe(ar)
        
    }
})