import { expect } from "@playwright/test";
import { test } from '../../fixtures/user.fixture'
import { randomUUID } from 'crypto'
import { getHash } from '../../fixtures/authenticatedRequest'
import { createUser } from "../../util/user";

test.describe("Delete Positive Scenarios", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
    })

    test("Deletion of todo should work if todo exists", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.delete(`/v2/todo/${id}`)
        expect(resp.status()).toBe(200)
    })

})

test("Deletion of non existing todo should give 400 via put endpoint", async ({ authenticatedRequest }, testInfo) => {
    const id = 1000
    const resp = await authenticatedRequest.put('/v2/todo/1000', { title: "Bring Milk" })
    expect(resp.status()).toBe(400)
})

test.describe("Delete request negative scenario", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
    })

    test("Deletion of Todo should not work if Authentication Details are not passed", async ({ authenticatedRequest, request }, testInfo) => {
        const id = testInfo['id']
        const resp = await request.delete(`/v2/todo/${id}`)
        expect(resp.status()).toBe(401)
    })

    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const deleteResp = await authenticatedRequest.delete(`/v2/todo/${id}`)
        expect(deleteResp.status()).toBe(200)
    })

})

test.describe('Unauthorized by different user', () => {
    test.beforeEach(async ({ authenticatedRequest, request }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Bring Milk' })
        const body = await resp.json()
        testInfo['id'] = body.id
        const unique = randomUUID()
        await createUser(request, {
            username: unique,
            password: unique
        });
        testInfo['unique'] = unique
    })
    test('One user should not be able to Delete other Users Todo', async ({ request }, testInfo) => {

        const id = testInfo['id']
        const resp = await request.delete(`/v2/todo/${id}`, {
            headers: {
                'Authorization': `Basic ${getHash(testInfo['unique'], testInfo['unique'])}`
            }
        })
        expect(resp.status()).toBe(404)
    })
    test.afterEach(async ({ authenticatedRequest, request }, testInfo) => {

        const id = testInfo['id']
        await request.delete('/v2/user', {
            headers: {
                'Authorization': `Basic ${getHash(testInfo['unique'], testInfo['unique'])}`
            }
        })
        await authenticatedRequest.delete(`/v2/todo/${id}`)
    })
})