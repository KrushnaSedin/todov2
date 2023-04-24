import { randomUUID } from "crypto";
import { test } from "../../fixtures/user.fixture";
import { expect } from "@playwright/test";
import { getHash } from "../../fixtures/authenticatedRequest";
import { createUser } from "../../util/user";

test.describe("Update Requests using patch",()=>{

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
    })

    test("Updating only title of todo via patch endpoint should work", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.patch(`v2/todo/${id}`,{title:'Bring Tiger'})
        const body= await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.id).toBe(id)
    })

    test("Updating only status of todo via patch endpoint should work", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.patch(`v2/todo/${id}`,{status:'DONE'})
        const body= await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.id).toBe(id)
        expect(body.status).toBe('DONE')
        
    })

    test("Updation of status todo should give 400 when status is not either of ACTIVE or DONE", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.patch(`v2/todo/${id}`,{status:'INACTIVE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
        expect(body.title).not.toBe(null)
        expect(body.status).not.toBe('DONE')
        
    })

    test("Updation of both status and title should work via patch endpoint", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.patch(`v2/todo/${id}`,{title:"Hello World",status:'DONE'})
        const body= await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.status).toBe('DONE')
        expect(body.id).toBe(id)
        
    })

    test("Updation of both title and status of todo should give 400 when status is not either of ACTIVE or DONE in patch", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.patch(`v2/todo/${id}`,{title:'Hello Sedin',status:'INACTIVE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
        expect(body.title).not.toBe(null)
        //expect(body.status).toBe('INACTIVE')
        
    })

    test("Updation of non existing todo should give 400 via patch endpoint", async ({authenticatedRequest},testInfo)=>{
        const id= 0
        const resp= await authenticatedRequest.patch(`v2/todo/${id}`,{title:'Hello Sedin',status:'INACTIVE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
        
    })
    test("Updation of Todo Via Patch endpoint should not work if Authentication details are not passed", async ({ request }, testInfo) => {
        const id = testInfo['id']
        const resp = await request.patch(`v2/todo/${id}`,{ title:"Hello Sedin"})
        const body = await resp.json()
        expect(resp.status()).toBe(401)
    })

    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const deleteResp = await authenticatedRequest.delete(`/v2/todo/${id}`)
        expect(deleteResp.status()).toBe(200)
    })
})

test.describe('Unauthorized by different user for Patch', () => {
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

    test('One user should not be able to Patch other Users Todo', async ({ request }, testInfo) => {

        const id = testInfo['id']
        const resp = await request.patch(`/v2/todo/${id}`, {
            data:{title:'Changed Title'},
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

test.describe("Update Requests using PUT",()=>{

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post('/v2/todo', { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
    })

    test("Updation of both status and title should work via PUT endpoint", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`v2/todo/${id}`,{title:"Hello World",status:'DONE'})
        const body= await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.status).toBe('DONE')
        expect(body.id).toBe(id)
        
    })
    test("Updation of both title and status of todo should give 400 when status is not either of ACTIVE or DONE in put", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`v2/todo/${id}`,{title:'Hello Sedin',status:'INACTIVE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
        expect(body.title).not.toBe(null)
        expect(body.status).not.toBe('DONE')
        
    })

    test("Updation of only title should give 400 in put", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`v2/todo/${id}`,{title:'Bring Tiger'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
               
    })
    test("Updation of only status should give 400 in put", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`v2/todo/${id}`,{status:'DONE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
               
    })

    test("Updation of non existing todo should give 400 via put endpoint", async ({authenticatedRequest},testInfo)=>{
        const id= 2500
        const resp= await authenticatedRequest.put(`v2/todo/${id}`,{title:'Hello Sedin',status:'INACTIVE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
        
    })

    test("Updation of Todo Via Put endpoint should not work if Authentication details are not passed", async ({ request }, testInfo) => {
        const id = testInfo['id']
        const resp = await request.put(`v2/todo/${id}`,{title:"Hello Sedin",status:"DONE"})
        const body = await resp.json()
        expect(resp.status()).toBe(401)
    })

    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const deleteResp = await authenticatedRequest.delete(`/v2/todo/${id}`)
        expect(deleteResp.status()).toBe(200)
    })
})

test.describe('Unauthorized by different user for Put', () => {
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
    test('One user should not be able to Put other Users Todo', async ({ request }, testInfo) => {

        const id = testInfo['id']
        const resp = await request.put(`/v2/todo/${id}`, {
            data:{title:'Changed Title',status:"DONE"},
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