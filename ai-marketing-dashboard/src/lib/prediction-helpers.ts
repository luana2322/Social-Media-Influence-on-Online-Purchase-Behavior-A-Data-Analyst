export interface PredictionResult {
  id: number;
  jobId: number;
  recordId: string;
  probability: number;
  segment: string;
  modelVersion: string;
  createdAt: string;
}

export function formatProbability(prob: number): string {
  return `${(prob * 100).toFixed(1)}%`;
}

export function getProbabilityLevel(prob: number): { label: string; color: string } {
  if (prob >= 0.8) return { label: 'Rất cao', color: 'text-red-600' };
  if (prob >= 0.71) return { label: 'Cao', color: 'text-orange-500' };
  if (prob >= 0.4) return { label: 'Trung bình', color: 'text-yellow-600' };
  return { label: 'Thấp', color: 'text-green-600' };
}

export function getSegmentExplanation(segment: string): string {
  const explanations: Record<string, string> = {
    'High': 'Xác suất mua ≥ 80%. Khách hàng có ý định mua hàng rất cao, đang trong giai đoạn quyết định. Cần chốt đơn ngay lập tức.',
    'Medium': 'Xác suất mua 40-79%. Khách hàng đang tìm hiểu và cân nhắc. Cần cung cấp thêm thông tin và khuyến mãi để thúc đẩy.',
    'Low': 'Xác suất mua < 40%. Khách hàng chưa có nhu cầu mua hàng. Cần xây dựng thương hiệu và nhận thức về sản phẩm.',
  };
  return explanations[segment] || 'Không xác định';
}

export function getSegmentExplanationEn(segment: string): string {
  const explanations: Record<string, string> = {
    'High': 'Customer has very high purchase intent. Engage immediately with attractive offers.',
    'Medium': 'Customer is considering. Needs more information and nurturing campaigns.',
    'Low': 'Customer is not ready to buy. Use educational content to build awareness.',
  };
  return explanations[segment] || 'Unknown';
}

export function getActionableAdvice(segment: string): string[] {
  const advice: Record<string, string[]> = {
    'High': [
      '🎯 Gửi mã giảm giá trong 24h',
      '📱 Retargeting ads sản phẩm đã xem',
      '⚡ Flash sale với thời gian có hạn',
      '🛒 Reminder giỏ hàng bị bỏ quên',
    ],
    'Medium': [
      '📧 Email nurturing 5-7 ngày',
      '🎁 Tặng mã giảm giá 10-15%',
      '📝 Gửi bài viết đánh giá sản phẩm',
      '🔍 Retargeting với social proof',
    ],
    'Low': [
      '📚 Content marketing giáo dục',
      '🎁 Lead magnet đổi email lấy tài nguyên',
      '📊 Newsletter chia sẻ kiến thức ngành',
      '⏰ Chuyển vào long-term nurture',
    ],
  };
  return advice[segment] || [];
}

export function getSegmentColor(segment: string): string {
  const colors: Record<string, string> = {
    'High': 'bg-red-100 text-red-800 border-red-300',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Low': 'bg-green-100 text-green-800 border-green-300',
  };
  return colors[segment] || 'bg-gray-100 text-gray-800';
}

export function getProbabilityBarColor(prob: number): string {
  if (prob >= 0.8) return 'bg-red-500';
  if (prob >= 0.71) return 'bg-orange-500';
  if (prob >= 0.4) return 'bg-yellow-500';
  return 'bg-green-500';
}
