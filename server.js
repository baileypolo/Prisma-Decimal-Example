// import packages and declare which port to use
const fastify = require('fastify')({logger: true})
const Prisma = require('prisma/prisma-client')
const prisma = new Prisma.PrismaClient()
const PORT = 5000

fastify.get('/test_types', async (req, reply) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        account_id : {
          equals: 1
        }
      }
    })
    const remaining = account.balance + account.credit
    reply.send({
      account_id_type: typeof account.account_id,
      balance_type: typeof account.balance,
      credit_type: typeof account.credit,
    })
    
  } catch (error) {
    reply.send(send({error: err.message}))
  }
})

fastify.get('/bad_rounding', async (req, reply) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        account_id : {
          equals: 1
        }
      }
    })
    const remaining = account.balance + account.credit
    reply.send({result: remaining})
    
  } catch (error) {
    reply.send(send({error: err.message}))
  }
})

fastify.get('/good_addition', async (req, reply) => {
  try {
    const account = await prisma.account.findMany({
      where: {
        OR: [
          {account_id : {
            equals: 1
          }},
          {account_id : {
            equals: 2
          }}
        ]
      }
    })
    const total = account[0].balance.plus(account[1].balance)
    reply.send({result: total})
  } catch (error) {
    reply.send(send({error: err.message}))
  }
})

fastify.get('/bad_addition', async (req, reply) => {
  try {
    const account = await prisma.account.findMany({
      where: {
        OR: [
          {account_id : {
            equals: 1
          }},
          {account_id : {
            equals: 2
          }}
        ]
      }
    })
    const total = account[0].balance + (account[1].balance)
    reply.send({result: total})
  } catch (error) {
    reply.send(send({error: err.message}))
  }
})

fastify.get('/sum_of_credit', async (req, reply) => {
  try {
    const all_accounts = await prisma.account.findMany()
    const compute = all_accounts[0].credit + all_accounts[1].credit + all_accounts[2].credit
    reply.send(compute)
    
  } catch (error) {
    reply.send(send({error: err.message}))
  }
})

fastify.get('/sum_of_balance', async (req, reply) => {
  try {
    const all_accounts = await prisma.account.findMany()
    const compute = all_accounts[0].balance.plus(all_accounts[1].balance).plus(all_accounts[2].balance)
    reply.send(compute)
    
  } catch (error) {
    reply.send(send({error: err.message}))
  }
})


const start = async() => {
  try {
    await fastify.listen(PORT)
  }
  catch {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()