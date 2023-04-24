// import{expect} from '@playwright/test'
// import {test} from '../../fixtures/user.fixture'
// test('creation of todo should work',async ({request,authenticatedRequest})=>{

//     const resp= await authenticatedRequest.post('/v2/todo',
//      {
//             title:'Bring Milk'
//     })
//     expect(resp.status()).toBe(201)
//     })

import { expect } from '@playwright/test'
import { test } from '../../fixtures/user.fixture'

test.describe("Create request Positive test cases", () => {
    test('Creation of todo should work without passing status field', async ({ request, authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Bring Milk' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        expect(body.title).not.toBe(null)
        expect(body.id).not.toBe(null)
        expect(body.title).toBe('Bring Milk')
        testInfo['id'] = body.id
    })
    test('Creation of todo should work when passed status field', async ({ request, authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Bring Milk', status: "DONE" })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        expect(body.title).not.toBe(null)
        expect(body.id).not.toBe(null)
        expect(body.title).toBe('Bring Milk')
        expect(body.status).toBe("DONE")
        testInfo['id'] = body.id
    })
    
    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const deleteResp = await authenticatedRequest.delete(`/v2/todo/${id}`)
        expect(deleteResp.status()).toBe(200)
    })
})
test.describe("Create request negative scebarios", () => {
    test("Creation of Todo should give 400 when title field is not passed", async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { status: "DONE" })
        const body = await resp.json()
        expect(resp.status()).toBe(400)
        testInfo['id'] = body.id
    })

    test("Creation of todo should give 400 when status value is not either ACTIVE or DONE", async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { status: "INACTIVE" })
        const body = await resp.json()
        expect(resp.status()).toBe(400)
        testInfo['id'] = body.id
    })

    test("Creation of Todo should not work if Authentication details are not passed", async ({ request }) => {
        const resp = await request.post('/v2/todo')
        const body = await resp.json()
        expect(resp.status()).toBe(401)
    })

})
