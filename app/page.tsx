"use client"

import Image from 'next/image'
import Link from 'next/link'
import ExpandingArrow from '@/components/expanding-arrow'
import Uploader from '@/components/uploader'
import {Toaster} from '@/components/toaster'
import useListObjects from "@/hooks/useListObjects";
import useDeleteObject from "@/hooks/useDeleteObject";
import LoadingDots from "@/components/loading-dots";

export default function Home() {
    const {objects, loading, error, reload} = useListObjects()
    const {deleteObject} = useDeleteObject()
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center">
            <Toaster/>
            <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
                Trabajo Práctico 3
            </h1>
            <div
                className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
                <Uploader callback={reload}/>
            </div>
            <div
                className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full mt-4">
                {/* List of objects with a delete button and a view button */}
                <div className="space-y-1 mb-4">
                    <h2 className="text-xl font-semibold">Archivos subidos</h2>
                    {!error && loading && <p>Cargando...</p>}
                    {error && <p>Error</p>}
                    {!error && !loading && objects && objects.length === 0 && <p>No hay archivos</p>}
                    {objects && objects.length > 0 && objects.map((object: any) => (
                        <div className="flex items-center justify-between" key={object.pathname}>
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-row">
                                    <button
                                        className="align-middle mr-2 p-2 border-black bg-black text-white hover:bg-white hover:text-black flex items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
                                    >
                                        <Link className="text-sm" href={object.url} target="_blank">Ver</Link>
                                    </button>
                                    <button
                                        className="align-middle mr-2 p-1 border-black bg-black text-white hover:bg-white hover:text-black flex items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
                                        onClick={() => {
                                            deleteObject(object.url).then(() => reload())
                                        }}
                                    >
                                        <p className="text-sm">Borrar</p>
                                    </button>
                                    <div className="align-middle flex">
                                        <span className="leading-10 text-sm font-semibold ">{object.pathname}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
