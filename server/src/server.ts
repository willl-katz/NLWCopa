import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { poolRoutes } from './routes/pool'
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/game'
import { guessRoutes } from './routes/guess'
import { userRoutes } from './routes/user'

async function bootstrap() {
    const fastify = Fastify({
        logger: true, // Ele vai soutando loggers de tudo que quê ta acontecendo na aplicação
    })

    await fastify.register(cors, {
        // Qualquer aplicação poderá acessar o back-end.
        origin: true,
    })

    // Em produção isso precisa ser uma variável ambiente
    await fastify.register(jwt, {
        secret: 'nlwcopa',
    })

    await fastify.register(poolRoutes)
    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(userRoutes)

    // Isso irá rodar para web(port) e mobile(host)
    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()