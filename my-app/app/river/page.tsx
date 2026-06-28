'use client';

import { useRive } from '@rive-app/react-canvas';
import { useEffect } from 'react';

export default function RiverPage() {
  const { RiveComponent, rive } = useRive({
    src: '/expression.riv',
    stateMachines: 'Grid',
    autoplay: true,
  });

  useEffect(() => {
    if (!rive) return;
    console.log('State Machines:', JSON.stringify(rive.stateMachineNames));
    console.log('Animations:', JSON.stringify(rive.animationNames));
    const inputs = rive.stateMachineInputs('Grid');
    console.log('Inputs:', JSON.stringify(inputs?.map(i => ({ name: i.name, type: i.type, value: i.value }))));
  }, [rive]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <RiveComponent style={{ width: 300, height: 300 }} />
    </div>
  );
}