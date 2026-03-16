// Vercel Web Analytics + Speed Insights (framework-agnostic injection).
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

inject();
injectSpeedInsights();
