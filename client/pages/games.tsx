import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function GamesPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the game HTML
        window.location.href = '/yenquit-game.html';
    }, []);

    return (
        <>
            <Head>
                <title>Yenquit Games | Gamified Tobacco Cessation</title>
                <meta name="description" content="Play Yenquit games to fight tobacco cravings" />
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-teal-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading games...</p>
                </div>
            </div>
        </>
    );
}
