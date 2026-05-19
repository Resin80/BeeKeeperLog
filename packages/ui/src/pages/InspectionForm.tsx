import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createInspection, updateInspection, fetchInspectionById, uploadImage } from '../services/api';
import FrameSelector from '../components/FrameSelector';
import { Camera, Mic, MicOff } from 'lucide-react';

const InspectionForm: React.FC = () => {
  const { id, inspId } = useParams<{ id: string, inspId?: string }>();
  const isEdit = Boolean(inspId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    queenSeen: false,
    eggsPresent: false,
    broodPattern: 'Solid',
    temperament: 'Calm',
    population: 'Average',
    honeySupers: '0',
    broodBoxes: '1',
    queenColor: 'Unmarked',
    queenCellsFound: false,
    queenCellsAction: '',
    framesOfBees: 0,
    framesOfFood: 0,
    frameData: '0,0,0,0,0,0,0,0,0,0',
    miteCount: '',
    notes: '',
    imagePath: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        notes: prev.notes ? `${prev.notes} ${transcript}` : transcript
      }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    if (isEdit && inspId) {
      fetchInspectionById(inspId).then(insp => {
        setFormData({
          date: new Date(insp.date).toISOString().split('T')[0],
          queenSeen: insp.queenSeen,
          eggsPresent: insp.eggsPresent,
          broodPattern: insp.broodPattern,
          temperament: insp.temperament,
          population: insp.population,
          honeySupers: (insp.honeySupers || 0).toString(),
          broodBoxes: (insp.broodBoxes || 1).toString(),
          queenColor: insp.queenColor || 'Unmarked',
          queenCellsFound: insp.queenCellsFound,
          queenCellsAction: insp.queenCellsAction || '',
          framesOfBees: insp.framesOfBees || 0,
          framesOfFood: insp.framesOfFood || 0,
          frameData: insp.frameData || '0,0,0,0,0,0,0,0,0,0',
          miteCount: (insp.miteCount || '').toString(),
          notes: insp.notes || '',
          imagePath: insp.imagePath || ''
        });
        if (insp.imagePath) {
          setImagePreview(insp.imagePath);
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [inspId, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImagePath = formData.imagePath;

      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        finalImagePath = uploadRes.imageUrl;
      }

      const data = {
        ...formData,
        hiveId: id,
        imagePath: finalImagePath,
        miteCount: formData.miteCount ? parseInt(formData.miteCount) : null,
        honeySupers: parseInt(formData.honeySupers),
        broodBoxes: parseInt(formData.broodBoxes),
        queenColor: formData.queenSeen ? formData.queenColor : null,
        framesOfBees: formData.framesOfBees,
        framesOfFood: formData.framesOfFood,
        frameData: formData.frameData,
        queenCellsFound: formData.queenCellsFound,
        queenCellsAction: formData.queenCellsFound ? formData.queenCellsAction : null
      };

      if (isEdit && inspId) {
        await updateInspection(inspId, data);
      } else {
        await createInspection(data);
      }
      navigate(`/hives/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save inspection');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) return <div className="container">Loading inspection data...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/hives/${id}`} style={{ color: '#666', textDecoration: 'none' }}>&larr; Back to Hive</Link>
        <h1 style={{ marginTop: '10px' }}>{isEdit ? 'Edit Inspection' : 'Log Inspection'}</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Inspection Photo</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', padding: '20px', border: '2px dashed #ddd', borderRadius: '12px', background: '#f9f9f9' }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <Camera size={48} color="#ccc" />
              )}
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={handleImageChange} 
                id="insp-image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="insp-image-upload" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                {imagePreview ? 'Change Photo' : 'Take Frame Photo'}
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              required 
            />
          </div>

          <div className="card" style={{ background: '#F9F7F2', border: '1px dashed #D7CCC8' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Brood Setup</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, broodBoxes: '1' }))}
                  className="btn"
                  style={{ flex: 1, background: formData.broodBoxes === '1' ? '#4CAF50' : '#fff', color: formData.broodBoxes === '1' ? '#fff' : '#666', border: '1px solid #4CAF50' }}
                > Single Brood </button>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, broodBoxes: '2' }))}
                  className="btn"
                  style={{ flex: 1, background: formData.broodBoxes === '2' ? '#4CAF50' : '#fff', color: formData.broodBoxes === '2' ? '#fff' : '#666', border: '1px solid #4CAF50' }}
                > Double Brood </button>
              </div>
            </div>
            <FrameSelector 
              initialData={formData.frameData}
              frameCount={formData.broodBoxes === '2' ? 20 : 10}
              onChange={(beeCount: number, data: string, foodCount: number) => setFormData(prev => ({ 
                ...prev, 
                framesOfBees: beeCount, 
                framesOfFood: foodCount,
                frameData: data 
              }))}
            />
          </div>

          <div className="card" style={{ background: '#FFF0F0', border: '1px solid #FFCDD2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 'bold', color: '#D32F2F' }}>Swarm Check (Queen Cells)</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="queenCellsFound" 
                  checked={formData.queenCellsFound} 
                  onChange={handleChange} 
                />
                Cells Found?
              </label>
            </div>
            {formData.queenCellsFound && (
              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Action Taken</label>
                <select 
                  name="queenCellsAction" 
                  value={formData.queenCellsAction || ''} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="">-- Select Action --</option>
                  <option>Destroyed all cells</option>
                  <option>Left 1 cell (Re-queening)</option>
                  <option>Artificial Swarm (Split)</option>
                  <option>Marked for split later</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" name="queenSeen" checked={formData.queenSeen} onChange={handleChange} />
              Queen Seen?
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" name="eggsPresent" checked={formData.eggsPresent} onChange={handleChange} />
              Eggs Present?
            </label>
          </div>

          {formData.queenSeen && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Queen Marking Color</label>
              <select 
                name="queenColor" 
                value={formData.queenColor} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option>Unmarked</option>
                <option value="Queenless">-- QUEENLESS --</option>
                <option>White (Year 1, 6)</option>
                <option>Yellow (Year 2, 7)</option>
                <option>Red (Year 3, 8)</option>
                <option>Green (Year 4, 9)</option>
                <option>Blue (Year 5, 0)</option>
              </select>
            </div>
          )}

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Brood Pattern</label>
              <select name="broodPattern" value={formData.broodPattern} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option>Solid</option>
                <option>Spotty</option>
                <option>Poor</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Temperament</label>
              <select name="temperament" value={formData.temperament} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option>Calm</option>
                <option>Nervous</option>
                <option>Aggressive</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Population</label>
            <select name="population" value={formData.population} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option>Low</option>
              <option>Average</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Honey Supers on Hive</label>
            <input 
              type="number" 
              name="honeySupers" 
              value={formData.honeySupers} 
              onChange={handleChange}
              min="0"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Mite Count (if tested)</label>
            <input 
              type="number" 
              name="miteCount" 
              value={formData.miteCount} 
              onChange={handleChange}
              placeholder="e.g. 3"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 'bold' }}>Notes</label>
              <button 
                type="button" 
                onClick={startListening}
                className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'}`}
                style={{ 
                  padding: '4px 12px', 
                  fontSize: '0.8rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  background: isListening ? '#ffebee' : '#f5f5f5'
                }}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                {isListening ? 'Listening...' : 'Dictate'}
              </button>
            </div>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
            {isEdit ? 'Update Inspection' : 'Save Inspection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InspectionForm;
