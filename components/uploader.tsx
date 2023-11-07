'use client'

import { useState, useCallback, useMemo, ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import LoadingDots from './loading-dots'
import { BlobResult } from '@vercel/blob'

export default function Uploader({ callback }: { callback?: () => void }) {
  const [data, setData] = useState<{
    image: string | null
  }>({
    image: null,
  })
  const [file, setFile] = useState<File | null>(null)

  const [dragActive, setDragActive] = useState(false)

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0]
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error('File size too big (max 50MB)')
        } else {
          setFile(file)
          const reader = new FileReader()
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }))
          }
          reader.readAsDataURL(file)
        }
      }
    },
    [setData]
  )

  const [saving, setSaving] = useState(false)

  const saveDisabled = useMemo(() => {
    return !data.image || saving
  }, [data.image, saving])

  return (
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault()
        setSaving(true)
        fetch('/api/upload', {
          method: 'POST',
          // @ts-ignore
          headers: {
            'content-type': file?.type || 'application/octet-stream',
            'x-filename': file?.name
          },
          body: file,
        }).then(async (res) => {
          if (res.status === 200) {
            const { url } = (await res.json()) as BlobResult
            callback && callback()
            toast(
              (t) => (
                <div className="relative">
                  <div className="p-2">
                    <p className="font-semibold text-gray-900 px-4">
                      Archivo subido correctamente
                    </p>
                  </div>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-0 -right-2 inline-flex text-gray-400 focus:outline-none focus:text-gray-500 rounded-full p-1.5 hover:bg-gray-100 transition ease-in-out duration-150"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 5.293a1 1 0 011.414 0L10
                          8.586l3.293-3.293a1 1 0 111.414 1.414L11.414
                          10l3.293 3.293a1 1 0 01-1.414 1.414L10
                          11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586
                          10 5.293 6.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ),
              { duration: 300000 }
            )
          } else {
            const error = await res.text()
            toast.error(error)
          }
          setSaving(false)
        })
      }}
    >
      <div>
        <div className="space-y-1 mb-4">
          <h2 className="text-2xl font-semibold">Seleccionar archivo</h2>
        </div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-16 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(false)

              const file = e.dataTransfer.files && e.dataTransfer.files[0]
              if (file) {
                if (file.size / 1024 / 1024 > 50) {
                  toast.error('File size too big (max 50MB)')
                } else {
                  setFile(file)
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    setData((prev) => ({
                      ...prev,
                      image: e.target?.result as string,
                    }))
                  }
                  reader.readAsDataURL(file)
                }
              }
            }}
          />
          <div
            className={`${
              dragActive ? 'border-2 border-black' : ''
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data.image
                ? 'bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md'
                : 'bg-white opacity-100 hover:bg-gray-50'
            }`}
          >

            <p className="mt-2 text-center text-sm text-gray-500">
              Arrastrar y soltar archivo
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
          {file?.name && file.name}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="*"
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
      </div>

      <button
        disabled={saveDisabled}
        className={`${
          saveDisabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            : 'border-black bg-gray-800/75 text-white hover:bg-white/75 hover:text-black'
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {saving ? (
          <LoadingDots color="#808080" />
        ) : (
          <p className="text-sm">Subir</p>
        )}
      </button>
    </form>
  )
}
