import { Suspense } from 'react';
import CarDetailClient from './CarDetailClient';

export default function CarDetailPage({ params }) {
  return (
    <Suspense fallback={<div style={{ padding: '160px 24px', textAlign: 'center' }}>Loading car details...</div>}>
      <CarDetailClient params={params} />
    </Suspense>
  );
}
