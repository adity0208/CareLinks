export function generateRecommendations(score: number, factors: any[]): string[] {
  const recommendations = [
    'Schedule follow-up appointment within 2 weeks',
    'Review medication adherence',
    'Conduct comprehensive health assessment'
  ];

  if (score > 80) {
    recommendations.push('Immediate intervention required');
    recommendations.push('Consider specialist referral');
  }

  return recommendations;
}