import {expect} from '@playwright/test'
import {test} from '../../fixtures/user.fixture'

test.describe("Get Request Positive scenarios",()=>{

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
    })

    test("Getting existing todo should work",async ({authenticatedRequest},testInfo)=>{

        const id=testInfo['id']
        const resp= await authenticatedRequest.get(`v2/todo/${id}`)
        const body=await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.id).toBe(id)
        expect(body).not.toBe(null)
    })

    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const deleteResp = await authenticatedRequest.delete(`/v2/todo/${id}`)
        expect(deleteResp.status()).toBe(200)
    })
})

test("Getting nonexisting todo should give 404",async ({authenticatedRequest})=>{

    const id=2000
    const resp= await authenticatedRequest.get(`v2/todo/${id}`)
    expect(resp.status()).toBe(404)
})

test.describe("Getting All Todo should give list of all todos created recently",()=>{

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
    })
    for(let i=0;i<5;i++)
    {
        test(`Get data for user ${i}`,async ({authenticatedRequest},testInfo)=>{

            const id=testInfo['id']
            const resp= await authenticatedRequest.get(`v2/todo/${id}`)
            const body=await resp.json()
            expect(resp.status()).toBe(200)
            expect(body.id).toBe(id)
            expect(body).not.toBe(null)
            console.log(i)
        }) 
    }
    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const deleteResp = await authenticatedRequest.delete(`/v2/todo/${id}`)
        expect(deleteResp.status()).toBe(200)
    })
})