import { Router } from 'express';

const router = Router();

async function callMLModel(complaintData) {
  const mlUrl = process.env.ML_MODEL_URL || 'http://localhost:8000/api/predict';

  const payload = {
    complaint_type: complaintData.complaintType,
    description: complaintData.description,
    subject: complaintData.subject,
    device_info: complaintData.deviceInfo,
  };
  if (complaintData.file_path) {
    payload.file_path = complaintData.file_path;
  }

  try {
    const response = await fetch(mlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`ML model responded with ${response.status}`);

    const result = await response.json();
    return {
      isThreat: result.is_threat ?? result.isThreat ?? false,
      category: result.category ?? 'unknown',
      confidence: result.confidence ?? 0,
      analyzedAt: new Date(),
    };
  } catch (error) {
    console.warn(`ML model unavailable (${error.message}), using fallback`);
    // Fallback: simulate based on complaint type for development
    const threatTypes = [
      'Hacking / Unauthorized Access',
      'Ransomware',
      'Data Breach',
      'Identity Theft',
    ];
    const isThreat = threatTypes.includes(complaintData.complaintType);
    return {
      isThreat,
      category: complaintData.complaintType,
      confidence: 0.85,
      analyzedAt: new Date(),
    };
  }
}

router.post('/', async (req, res) => {
  try {
    const mlResult = await callMLModel(req.body);

    res.status(200).json({
      success: true,
      complaint: {
        _id: Date.now().toString(),
        status: 'analyzed',
      },
      mlResult,
    });
  } catch (error) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  res.status(404).json({ success: false, message: 'Complaint storage moved to localStorage. Use frontend to retrieve complaints.' });
});

export default router;
