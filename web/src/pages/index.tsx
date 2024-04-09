// Para poder utilizar imagem no nextJS
import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'

import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

import { ModalCode } from '../components/ModalCode'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  const [takeCode, setTakeCode] = useState('')
  const [showModal, setShowModal] = useState(false)

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      // alert(
      //   'Bolão criado com sucesso, o código foi criado para a área de transferência!',
      // )

      setShowModal(true)
      setPoolTitle('')

      return setTakeCode(code)
    } catch (error) {
      console.log(error)
      alert('Falha ao criar o bolão, tente novamente!')
    }
  }

  function CloseModal() {
    return setShowModal(false)
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      {showModal ? <ModalCode code={takeCode} CloseModal={CloseModal} /> : null}
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-white placeholder:text-gray-place"
            type="text"
            name=""
            id=""
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            CRIAR MEU BOLÃO
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 divide-x divide-gray-600 grid grid-cols-2 text-gray-100">
          <div className="flex items-center justify-start gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col ">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col ">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibido uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  // executara uma promessa em array, fazendo com que ambas sejam executadas juntas
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api('pools/count'),
      api('guesses/count'),
      api('users/count'),
    ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  }
}
