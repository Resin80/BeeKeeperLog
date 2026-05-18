import React, { useState, useEffect } from 'react';

interface FrameSelectorProps {
  initialData?: string;
  frameCount?: number;
  onChange: (beeCount: number, data: string, foodCount: number) => void;
  readOnly?: boolean;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({ initialData, frameCount = 10, onChange, readOnly = false }) => {
  // States: 0 = Empty, 1 = Bees, 2 = Food
  const [frames, setFrames] = useState<number[]>(
    initialData 
      ? initialData.split(',').map(v => parseInt(v))
      : new Array(frameCount).fill(0)
  );

  // Update frames if frameCount changes
  useEffect(() => {
    if (!initialData) {
      setFrames(new Array(frameCount).fill(0));
    }
  }, [frameCount, initialData]);

  const toggleFrame = (index: number) => {
    if (readOnly) return;
    const newFrames = [...frames];
    // Cycle: 0 -> 1 (Bees) -> 2 (Food) -> 0
    newFrames[index] = (newFrames[index] + 1) % 3;
    setFrames(newFrames);
    
    const beeCount = newFrames.filter(v => v === 1).length;
    const foodCount = newFrames.filter(v => v === 2).length;
    const data = newFrames.join(',');
    onChange(beeCount, data, foodCount);
  };

  const beeCount = frames.filter(v => v === 1).length;
  const foodCount = frames.filter(v => v === 2).length;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Visual Population Map ({frameCount} Frames)</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ 
            background: '#FFF7E6', 
            color: '#FFB900', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontSize: '0.8rem',
            fontWeight: 'bold',
            border: '1px solid #FFB900'
          }}>
            {beeCount} Bees
          </span>
          <span style={{ 
            background: '#E3F2FD', 
            color: '#2196F3', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontSize: '0.8rem',
            fontWeight: 'bold',
            border: '1px solid #2196F3'
          }}>
            {foodCount} Food
          </span>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '4px', 
        padding: '15px', 
        background: '#8D6E63', // Wood color for the box
        borderRadius: '8px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
        minHeight: '120px'
      }}>
        {frames.map((state, idx) => (
          <div 
            key={idx}
            onClick={() => toggleFrame(idx)}
            style={{ 
              flex: `1 0 ${frameCount > 10 ? '8%' : '9%'}`,
              minWidth: '20px',
              height: '90px',
              background: state === 1 ? '#FFB900' : (state === 2 ? '#64B5F6' : '#D7CCC8'), // Gold, Blue, or Light Wood
              borderRadius: '4px',
              border: state > 0 ? '2px solid rgba(0,0,0,0.1)' : '1px solid #BCAAA4',
              cursor: readOnly ? 'default' : 'pointer',
              transition: 'all 0.1s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {state === 1 && (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                opacity: 0.2,
                background: 'repeating-linear-gradient(45deg, #000, #000 2px, transparent 2px, transparent 8px)' 
              }} />
            )}
            {state === 2 && (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                opacity: 0.15,
                background: 'radial-gradient(circle, #fff 10%, transparent 10%)',
                backgroundSize: '8px 8px'
              }} />
            )}
            <span style={{ 
              position: 'absolute', 
              bottom: '2px', 
              fontSize: '0.6rem', 
              color: state > 0 ? '#fff' : '#8D6E63',
              fontWeight: 'bold',
              textShadow: state > 0 ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
            }}>
              {idx + 1}
            </span>
          </div>
        ))}
      </div>
      {!readOnly && (
        <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '8px', textAlign: 'center' }}>
          Tap: Empty &rarr; <span style={{color:'#FFA000', fontWeight:'bold'}}>Bees</span> &rarr; <span style={{color:'#2196F3', fontWeight:'bold'}}>Food</span> &rarr; Empty
        </p>
      )}
    </div>
  );
};

export default FrameSelector;
