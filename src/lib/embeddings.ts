import { pipeline } from '@xenova/transformers';

let instance: any = null;

export async function getEmbeddingPipeline() {
    if (!instance) {
        instance = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');
    }
    return instance;
}

export async function generateEmbedding(text: string): Promise<number[]> {
    const pipe = await getEmbeddingPipeline();
    const output = await pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data as Float32Array);
}
