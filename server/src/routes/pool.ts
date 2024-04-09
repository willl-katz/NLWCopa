import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from 'zod'
import ShortUniqueId from "short-unique-id"
import { authenticate } from "../plugins/authenticate"

export async function poolRoutes(fastify: FastifyInstance) {
    // http://localhost:3333/pools/count
    fastify.get('/pools/count', async () => {
        // É um contador de quantos resultados na table pool existem no total
        const count = await prisma.pool.count()

        // // Irá consultar em todos os resultados alguma coisa específica.
        // const pools = await prisma.pool.findMany({
        //     where: {
        //         code: {
        //             // todos que começam com W
        //             startsWith: 'W'
        //         }
        //     }
        // })

        return { count }
    })

    fastify.post('/pools', async (request, response) => {
        const createPoolBody = z.object({
            title: z.string(),
        })

        const { title } = createPoolBody.parse(request.body)

        const generate = new ShortUniqueId({ length: 6 })
        const code = String(generate()).toUpperCase()

        try {
            await request.jwtVerify()

            await prisma.pool.create({
                data: {
                    title,
                    code,
                    ownerId: request.user.sub,

                    participants: {
                        create: {
                            userId: request.user.sub
                        }
                    }
                }
            })
        } catch {
            await prisma.pool.create({
                data: {
                    title,
                    code
                }
            })
        }


        return response.status(201).send({ code })
    })

    fastify.post('/pools/join', {
        onRequest: [authenticate]
    }, async (request, response) => {
        const joinPoolBody = z.object({
           code: z.string(), 
        })

        const { code } = joinPoolBody.parse(request.body)

        const pool = await prisma.pool.findUnique({
            where: {
                code,
            },
            include: {
                participants: {
                    where: {
                        userId: request.user.sub,
                    }
                }
            }
        })

        if (!pool) {
            return response.status(400).send({
                message: 'Pool not found.',
            })
        }

        if (pool.participants.length > 0) {
            return response.status(400).send({
                message: 'You already joined this pool.',
            })
        }

        if (!pool.ownerId) {
            await prisma.pool.update({
                where: {
                    id: pool.id,
                },
                data: {
                    ownerId: request.user.sub,
                }
            })
        }

        await prisma.participant.create({
            data: {
                poolId: pool.id,
                userId: request.user.sub,
            }
        })

        return response.status(201).send()
    })

    fastify.get('/pools', {
        onRequest: [authenticate]
    }, async (request) => {
        const pools = await prisma.pool.findMany({
            where: {
                participants: {
                    some: {
                        userId: request.user.sub,
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        participants: true,
                    }
                },
                participants: {
                    select: {
                        id: true,

                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 4,
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            }
        })

        return { pools }
    })

    fastify.get('/pools/:id', {
        onRequest: [authenticate]
    }, async (request) => {
        const getPoolParams = z.object({
            id: z.string(),
        })

        const { id } = getPoolParams.parse(request.params)

        const pool = await prisma.pool.findUnique({
            include: {
                _count: {
                    select: {
                        participants: true,
                    }
                },
                participants: {
                    select: {
                        id: true,

                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 4,
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            },
            where: {
                id,
            },
        })

        return { pool }
    })

    fastify.delete('/pools/:id', {
        onRequest: [authenticate]
    }, async (request, response) => {
        const deletePoolParams = z.object({
            id: z.string(),
        })

        const { id } = deletePoolParams.parse(request.params)

        const deleteHistory = await prisma.participant.deleteMany({
            where: {
                poolId: {
                    equals: id,
                }
            },
        })

        const deletePool = await prisma.pool.delete({
            where: {
                id,
            },
        })

        return response.status(200).send({deleteHistory, deletePool})
    })
}