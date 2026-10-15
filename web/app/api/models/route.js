import { listProviders } from '@/lib/providers';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ providers: listProviders() });
}
