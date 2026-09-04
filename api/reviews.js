import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return response.status(500).json({ error: 'Supabase is not configured' });
  }

  const body = request.body || {};
  const studentName = String(body.student_name || '').trim();
  const promotionLevel = String(body.promotion_level || '').trim();
  const result = String(body.result || '').trim();

  if (!studentName || !['1품', '2품', '3품', '4품'].includes(promotionLevel) || !['pass', 'fail'].includes(result)) {
    return response.status(400).json({ error: 'Invalid review data' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from('promotion_reviews')
    .insert({
      student_name: studentName,
      promotion_level: promotionLevel,
      result,
      photo_data_url: body.photo_data_url || null,
      photo_filename: body.photo_filename || null,
    })
    .select('id')
    .single();

  if (error) {
    return response.status(500).json({ error: 'Unable to save review' });
  }

  return response.status(201).json({ id: data.id });
}
