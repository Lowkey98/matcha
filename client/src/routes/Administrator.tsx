import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getReports } from '../../Api';
import { ReportCardType } from '../../../shared/types';

export default function Administrator() {
  const [reports, setReports] = useState<ReportCardType[] | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getReports({ token })
        .then((reportsFromDb: ReportCardType[]) => {
          if (reportsFromDb.length) setReports(reportsFromDb);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  return (
    <>
      <Helmet>
        <title>Matcha - Administrator</title>
      </Helmet>
      {reports ? (
        <main className="mt-12 mb-22 lg:mb-5 lg:ml-57">
          <div>
            <h1 className="text-secondary text-2xl font-bold">
              Reported users
            </h1>
            <span className="lg:text-md text-sm font-light text-gray-300">
              View all reported users
            </span>
          </div>
          <div className="mt-12 flex flex-wrap gap-[1.4%] gap-y-4">
            {reports.map((report) => (
              <ReportCard key={report.userId} report={report} />
            ))}
          </div>
        </main>
      ) : null}
    </>
  );
}

function ReportCard({ report }: { report: ReportCardType }) {
  return (
    <div className="border-secondary flex w-full items-center justify-between rounded-lg border-2 p-3 lg:w-[23.9%]">
      <div className="flex flex-col">
        <span className="text-grayDark text-xs font-light">Username</span>
        <span className="text-secondary">{report.username}</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="text-grayDark text-xs font-light">Reports</span>
        <span className="text-secondary">{report.totalReports}</span>
      </div>
    </div>
  );
}
