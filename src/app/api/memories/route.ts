import { NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/embeddings';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { content, metadata } = await req.json();
        if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

        const embedding = await generateEmbedding(content);

        const { data, error } = await supabase
            .from('memories')
            .insert([
                { content, embedding, metadata }
            ])
            .select();

        if (error) throw error;

        return NextResponse.json(data[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    try {
        if (query) {
            const embedding = await generateEmbedding(query);
            // Using rpc for vector similarity search
            const { data, error } = await supabase.rpc('match_memories', {
                query_embedding: embedding,
                match_threshold: 0.5,
                match_count: 10,
            });
            if (error) throw error;
            return NextResponse.json(data);
        }

        const { data, error } = await supabase.from('memories').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
