import { Suspense } from 'react';
import BookingClient from './BookingClient';

export default function BookingPage({ params }) {
  return (
    <Suspense fallback={<div style={{ padding: '160px 24px', textAlign: 'center' }}>Loading checkout...</div>}>
      <BookingClient params={params} />
    </Suspense>
  );
}
