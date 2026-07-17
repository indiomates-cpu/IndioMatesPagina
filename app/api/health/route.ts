import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Health-check liviano para un ping externo (UptimeRobot) que mantenga
// despierta la base de datos. Hace la consulta más barata posible (SELECT 1),
// así el ping confirma que la app Y Postgres responden, sin tocar tablas.
//
// force-dynamic + no-store: nunca se cachea, así cada ping ejecuta la consulta
// de verdad (si se cacheara, la base se dormiría igual).
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { ok: true, ts: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Health-check falló:', error);
    return NextResponse.json(
      { ok: false },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
