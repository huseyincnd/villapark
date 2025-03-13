// src/pages/api/admin/test.js
import { isAuthenticated } from '../../../../lib/auth';

// Korumalı API endpoint
function handler(req, res) {
  // Sadece GET isteklerini kabul et
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Bu noktaya gelebildiyse yetkilendirme başarılı demektir
  return res.status(200).json({ 
    success: true, 
    message: 'Yetkilendirme başarılı', 
    user: req.user 
  });
}

// isAuthenticated middleware'i ile endpoint'i koru
export default isAuthenticated(handler);