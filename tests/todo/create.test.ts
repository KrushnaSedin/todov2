import{expect} from '@playwright/test'
import {test} from '../../fixtures/user.fixture'
test('creation of todo should work',async ({request,authenticatedRequest})=>{

    const resp= await authenticatedRequest.post('/v2/todo',
     {
            title:'Bring Milk'
    })
    expect(resp.status()).toBe(201)
    })