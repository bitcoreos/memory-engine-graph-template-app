import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { name, description, graph_data } = await req.json();
        if (!name || !graph_data) return NextResponse.json({ error: 'Name and graph_data are required' }, { status: 400 });

        const { data, error } = await supabase
            .from('templates')
            .insert([{ name, description, graph_data }])
            .select();

        if (error) throw error;
        return NextResponse.json(data[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
