import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiaryRoutes from './routes/apiaryRoutes';
import hiveRoutes from './routes/hiveRoutes';
import inspectionRoutes from './routes/inspectionRoutes';
import harvestRoutes from './routes/harvestRoutes';
import treatmentRoutes from './routes/treatmentRoutes';
import feedingRoutes from './routes/feedingRoutes';
import { upload, getUploadDir } from './upload';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Path to UI build files - handle both dev (src/index.ts) and prod (dist/src/index.js)
const uiPath = __dirname.includes('dist') 
  ? path.join(__dirname, '../../../ui/dist') 
  : path.join(__dirname, '../../ui/dist');

console.log(`Serving UI from: ${uiPath}`);

// Serve static files from the UI build
app.use(express.static(uiPath));

// Serve uploaded images
app.use('/uploads', express.static(getUploadDir()));

// General image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// API Routes
app.use('/api/apiaries', apiaryRoutes);
app.use('/api/hives', hiveRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/feedings', feedingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Fallback to React app for client-side routing
app.get('*any', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(uiPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
