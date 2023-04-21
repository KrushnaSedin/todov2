import { expect, request } from '@playwright/test'
import { test } from '../../fixtures/user.fixture'
import { randomUUID } from 'crypto'
import { getHash } from '../../fixtures/authenticatedRequest'
import { createUser} from '../../util/user'
import { TodoResponseBody, getAllTodos } from '../../util/todo'

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

    const id = 0
    const resp = await authenticatedRequest.get(`v2/todo/${id}`)
    expect(resp.status()).toBe(404)
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
    test('One user should not be able to get other Users Todo', async ({ request }, testInfo) => {

        const id = testInfo['id']
        const resp = await request.get(`/v2/todo/${id}`, {
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

//
test.describe('Get All',()=>{
    test.beforeEach(async ({authenticatedRequest},testInfo)=>{
      const todos = ['Bring Milk','Bring Vegitables']
      const createdTodos:TodoResponseBody[] = []
      for (const todo in todos){
        const resp = await authenticatedRequest.post('/v2/todo', { title: todo })
        const body = await resp.json()
        createdTodos.push(body)
      }
      testInfo['todos'] = createdTodos
    })
    test('Getting All Todo should give list of all todos created recently', async ({ authenticatedRequest },testInfo) => {
      const createdTodos:TodoResponseBody[] = testInfo['todos']
      const {status,body} = await getAllTodos(authenticatedRequest)
    expect(status).toBe(200)
      for(const createdTodo of createdTodos){
       const foundTodo = body.find(returnedTodo=>returnedTodo.id==createdTodo.id)
       expect(foundTodo?.id).toBe(createdTodo.id)
       expect(foundTodo?.title).toBe(createdTodo.title)
      }
    });

    test.afterEach(async ({authenticatedRequest},testInfo)=>{
      const createdTodos:TodoResponseBody[] = testInfo['todos']
      
      for(const createdTodo of createdTodos){
        const id= createdTodo.id
        const resp = await authenticatedRequest.delete(`/v2/todo/${id}`)
        expect(resp.status()).toBe(200)
       }
    })
  })