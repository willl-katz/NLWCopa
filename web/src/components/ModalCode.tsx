import Image from 'next/image'
import IconSuccess from '../assets/IconSucess.png'
import IconClose from '../assets/close.svg'

type ModalType = {
  code: string
  CloseModal: () => void
}

export function ModalCode({ code, CloseModal }: ModalType) {
  return (
    <div className="absolute bg-ignite-500 border-yellow-700 flex flex-col gap-9 glassy px-11 py-6">
      <div className="items-center flex flex-col gap-2">
        <div className="min-w-full flex justify-end">
          <Image
            src={IconClose}
            alt="Fechar aba"
            className="cursor-pointer"
            onClick={CloseModal}
          />
        </div>
        <Image src={IconSuccess} alt="Criado com sucesso!" />
        <div className="flex flex-col items-center font-bold text-white mx-5 negative-gap">
          <span>Criado com</span>
          <span className="text-4xl negative-margin">Sucesso!</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-white font-medium">Código:</p>
        <span className="px-6 py-3 bg-yellow-700 font-bold text-4xl rounded-lg text-center">
          {code}
        </span>
      </div>
    </div>
  )
  // 374852
}
