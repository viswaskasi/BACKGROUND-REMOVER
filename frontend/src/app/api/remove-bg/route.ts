import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File | null;

        if (!imageFile) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }


        // Forward the exact formData to the Python FastAPI backend
        const pythonBackendUrl = 'http://127.0.0.1:8000/remove-bg';
        
        const response = await fetch(pythonBackendUrl, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header manually when sending FormData
            // fetch will automatically set it with the correct boundary
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Python backend error (${response.status}): ${errorText}`);
        }

        // Get the binary PNG data from the Python response
        const arrayBuffer = await response.arrayBuffer();


        // Return the image directly to the frontend
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': 'inline; filename="removed-bg.png"',
            },
        });

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err).slice(0, 500);
        console.error('[Next.js Proxy] Error:', msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
