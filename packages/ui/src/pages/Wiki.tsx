import React from 'react';
import { BookOpen, Clock, Layout, AlertTriangle, CheckSquare, Coffee, ShieldAlert } from 'lucide-react';

const Wiki: React.FC = () => {
  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <BookOpen size={32} color="#FFB900" />
        <h1>Beekeeping Wiki & Help</h1>
      </div>

      <div className="grid">
        {/* Section 1: Queen Development */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Clock size={24} color="#FFB900" />
            <h2 style={{ margin: 0 }}>Queen Development</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { day: 'Day 1', event: 'Egg is laid' },
              { day: 'Day 3', event: 'Egg hatches into larva' },
              { day: 'Day 8', event: 'Cell is capped' },
              { day: 'Day 16', event: 'Queen emerges (Virgin)' },
              { day: 'Day 20-24', event: 'Mating flights occur' },
              { day: 'Day 25+', event: 'Egg laying begins' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', borderBottom: '1px solid #EEE', paddingBottom: '8px' }}>
                <strong style={{ width: '100px', color: '#5D4037' }}>{item.day}</strong>
                <span>{item.event}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '10px', background: '#FFF7E6', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #FFB900' }}>
            <strong>Pro Tip:</strong> Check your hive 16 days after a split or swarm to see if the new queen has emerged!
          </div>
        </div>

        {/* Section 2: Queen Cells */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Layout size={24} color="#4CAF50" />
            <h2 style={{ margin: 0 }}>Queen Cell Placement</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ padding: '10px', borderLeft: '4px solid #FFB900', background: '#F9F7F2' }}>
              <strong style={{ display: 'block', color: '#5D4037' }}>Swarm Cells</strong>
              <span style={{ fontSize: '0.9rem' }}>Located at the <strong>bottom</strong> of the frames. The colony is strong but feels crowded. They are planning to leave.</span>
            </div>
            <div style={{ padding: '10px', borderLeft: '4px solid #4CAF50', background: '#F9F7F2' }}>
              <strong style={{ display: 'block', color: '#5D4037' }}>Supersedure Cells</strong>
              <span style={{ fontSize: '0.9rem' }}>Located on the <strong>face/middle</strong> of the frame. They are replacing an old or failing queen.</span>
            </div>
            <div style={{ padding: '10px', borderLeft: '4px solid #2196F3', background: '#F9F7F2' }}>
              <strong style={{ display: 'block', color: '#5D4037' }}>Emergency Cells</strong>
              <span style={{ fontSize: '0.9rem' }}>Built after a sudden loss of the queen. These often protrude out from worker cells in the middle of the comb.</span>
            </div>
          </div>
        </div>

        {/* Section 3: Inspection Checklist */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <CheckSquare size={24} color="#FFB900" />
            <h2 style={{ margin: 0 }}>5-Point Checklist</h2>
          </div>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
            <li><strong>Eggs?</strong> Is the queen present and laying? (Find 1 egg per cell).</li>
            <li><strong>Room?</strong> Do they have space to expand, or are they getting "clogged" with honey?</li>
            <li><strong>Health?</strong> Any signs of mites, deformed wings, or odd smells?</li>
            <li><strong>Queen Cells?</strong> Are they preparing to swarm or supersede?</li>
            <li><strong>Food?</strong> Do they have at least 2 frames of honey/pollen stores?</li>
          </ul>
        </div>

        {/* Section 4: Feeding Ratios */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Coffee size={24} color="#795548" />
            <h2 style={{ margin: 0 }}>Syrup Ratios</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ padding: '10px', background: '#E8F5E9', borderRadius: '8px' }}>
              <strong style={{ color: '#2E7D32' }}>1:1 (Spring)</strong>
              <p style={{ fontSize: '0.9rem', margin: '5px 0 0' }}>1kg Sugar to 1L Water. Stimulates the queen to lay and mimics a nectar flow.</p>
            </div>
            <div style={{ padding: '10px', background: '#FFF3E0', borderRadius: '8px' }}>
              <strong style={{ color: '#E65100' }}>2:1 (Autumn)</strong>
              <p style={{ fontSize: '0.9rem', margin: '5px 0 0' }}>2kg Sugar to 1L Water. For building winter stores. Less water for them to evaporate.</p>
            </div>
          </div>
        </div>

        {/* Section 5: Disease ID */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <ShieldAlert size={24} color="#D32F2F" />
            <h2 style={{ margin: 0 }}>Disease ID</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>AFB (Foulbrood):</strong> Sunken, dark, greasy-looking cappings with holes. Larvae turn to "brown snot" (rope test). <span style={{color:'#D32F2F', fontWeight:'bold'}}>NOTIFY INSPECTOR.</span>
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Chalkbrood:</strong> Larvae look like hard, white/grey "mummies" or chalk. Common in damp springs.
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Deformed Wing (DWV):</strong> Wings look shriveled or missing. A clear sign of high Varroa mite levels.
            </div>
          </div>
        </div>

        {/* Section 6: Mite Thresholds */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <AlertTriangle size={24} color="#D93025" />
            <h2 style={{ margin: 0 }}>Varroa Thresholds</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#E6F4EA', borderRadius: '6px' }}>
              <span>0-2 Mites (per 100 bees)</span>
              <strong>Safe</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#FFF7E6', borderRadius: '6px' }}>
              <span>3-5 Mites</span>
              <strong>Monitor</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#FCE8E6', borderRadius: '6px', color: '#D93025' }}>
              <span>6+ Mites</span>
              <strong>TREAT</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wiki;
