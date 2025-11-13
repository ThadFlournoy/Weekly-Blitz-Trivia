'use client'

import { Metadata } from "next"
import "./ui/globals.css"
import { Roboto_Condensed } from 'next/font/google'
import { useState, useEffect } from 'react'

const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
    variable: '--font-roboto-condensed',
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    useEffect(() => {
        // Preload background image
        const img = new Image();
        img.src = '/background.jpg';
        img.onload = () => setImageLoaded(true);
    }, []);
    
    return (
        <html lang="en">
            <body className={`${robotoCondensed.className} relative min-h-screen overflow-hidden`}>
                {!imageLoaded ? (
                    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
                        <div className="text-center">
                            <div className="text-6xl mb-4 animate-spin">🏈</div>
                            <p className="text-yellow-400 text-xl font-bold">Loading...</p>
                        </div>
                    </div>
                ) : null}
                <div 
                    className="fixed inset-0 bg-[url('/background.jpg')] bg-cover bg-center blur-sm brightness-75 -z-10"
                ></div>
                {children}
            </body>
        </html>
    )
}
