import { useCallback, useEffect, useState } from 'react';
import DelinquencyChart from '../components/DelinquencyChart';
import FileUploadPanel from '../components/FileUploadPanel';
import LoanTable from '../components/LoanTable';
import PortfolioOverview from '../components/PortfolioOverview';
import RecourseDashboard from '../components/RecourseDashboard';

export default function Home() {
  const [metrics, setMetrics] = useState({ delinquency_buckets: {}, recourse_stats: {} });
  const [recourse, setRecourse] = useState({ loans: [] });
  const [loans, setLoans] = useState([]);

  const loadData = useCallback(async () => {
    const [metricsRes, recourseRes, loansRes] = await Promise.all([
      fetch('/api/metrics').then((r) => r.json()),
      fetch('/api/recourse').then((r) => r.json()),
      fetch('/api/loans').then((r) => r.json())
    ]);

    setMetrics(metricsRes);
    setRecourse(recourseRes);
    setLoans(loansRes.loans || []);
  }, []);

  useEffect(() => {
    loadData().catch(() => {});
  }, [loadData]);

  return (
    <main className="container">
      <h1>Ross Allen Financial — Lender Dashboard</h1>
      <FileUploadPanel onUploaded={loadData} />
      <PortfolioOverview metrics={metrics} />
      <DelinquencyChart buckets={metrics.delinquency_buckets || {}} />
      <RecourseDashboard recourse={recourse} />
      <LoanTable loans={loans} />
    </main>
  );
}
