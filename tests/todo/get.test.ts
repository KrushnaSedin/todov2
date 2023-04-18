import { expect, request } from '@playwright/test'
import { test } from '../../fixtures/user.fixture'
import { randomUUID } from 'crypto'
import { getHash } from '../../fixtures/authenticatedRequest'

test.describe("Get Request Positive scenarios", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
    })

    test("Getting existing todo should work", async ({ authenticatedRequest }, testInfo) => {

        const id = testInfo['id']
        const resp = await authenticatedRequest.get(`v2/todo/${id}`)
        const body = await resp.json()
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

test("Getting nonexisting todo should give 404", async ({ authenticatedRequest }) => {

    const id = 2000
    const resp = await authenticatedRequest.get(`v2/todo/${id}`)
    expect(resp.status()).toBe(404)
})

test.describe("Getting All Todo should give list of all todos created recently", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
    })
    for (let i = 0; i < 5; i++) {
        test(`Get data for user ${i}`, async ({ authenticatedRequest }, testInfo) => {

            const id = testInfo['id']
            const resp = await authenticatedRequest.get(`v2/todo/${id}`)
            const body = await resp.json()
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

test.describe("Get request negative scenario", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
    })

    test("Getting Single Todo should not work if authentication details are not passed", async ({ request }, testInfo) => {
        const id = testInfo['id']
        const resp = await request.get(`v2/todo/${id}`)
        const body = await resp.json()
        expect(resp.status()).toBe(401)
    })

    test("One user should not be able to Delete other Users Todo", async ({ authenticatedRequest, request }, testInfo) => {
        const id = testInfo['id']
        const unique = randomUUID()
        const resp = await request.delete(`/v2/todo/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${getHash(unique, unique)}`
            }
        })
        expect(resp.status()).toBe(401)
    })

    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const deleteResp = await authenticatedRequest.delete(`/v2/todo/${id}`)
        expect(deleteResp.status()).toBe(200)
    })
})

test("Getting all Todo should should not work if Authentication Details are not passed", async ({ request }) => {

    const resp = await request.get('v2/todo')
    expect(resp.status()).toBe(401)

})