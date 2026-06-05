import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      services: [
        {
          id: 'silver',
          name: 'Silver Package',
          duration: 30,
          description: 'Essential care — exterior wash, interior vacuum & dashboard wipe',
          eventTypeId: import.meta.env.NEXT_PUBLIC_CALCOM_EVENT_TYPE_ID,
        },
        {
          id: 'gold',
          name: 'Gold Package',
          duration: 60,
          description: 'Premium treatment — deep clean, seat shampooing & engine bay',
          eventTypeId: import.meta.env.NEXT_PUBLIC_CALCOM_GOLD_EVENT_TYPE_ID,
        },
        {
          id: 'platinum',
          name: 'Platinum Package',
          duration: 90,
          description: 'Ultimate luxury — polish, paint sealant & leather conditioning',
          eventTypeId: import.meta.env.NEXT_PUBLIC_CALCOM_PLATINUM_EVENT_TYPE_ID,
        },
        {
          id: 'detailed',
          name: 'Deep Detailing Package',
          duration: 120,
          description: 'Complete perfection — paint correction, ceramic coating & full detail',
          eventTypeId: import.meta.env.NEXT_PUBLIC_CALCOM_DETAILED_EVENT_TYPE_ID,
        },
        {
          id: 'diamond',
          name: 'Diamond Package',
          duration: 720,
          description: 'The ultimate transformation — full paint correction, multi-layer ceramic coating, interior restoration, engine bay detailing & lifetime protection',
          eventTypeId: import.meta.env.NEXT_PUBLIC_CALCOM_DIAMOND_EVENT_TYPE_ID,
        },
      ],
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
};