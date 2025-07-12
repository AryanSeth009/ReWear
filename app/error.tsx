'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Optionally log error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()} style={{ marginTop: 16, padding: '8px 16px' }}>
        Try again
      </button>
    </div>
  );
} 