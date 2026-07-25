import { getTranslations } from "next-intl/server";
import { Suspense } from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentContracts } from '@/components/dashboard/RecentContracts';
import { PlotBreakdown } from '@/components/dashboard/PlotBreakdown';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';

// Default date range - last 30 days
const defaultDateRange = {
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  to: new Date(),
};

// Default currency - should come from tenant settings
const defaultCurrency = 'PYG' as const;

export default async function DashboardPage() {
  const t = await getTranslations("pages.dashboard");

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {/* GPS Weather Card */}
      <WeatherCard />

      {/* Stats Cards */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        }
      >
        <StatsCards dateRange={defaultDateRange} currency={defaultCurrency} />
      </Suspense>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense
          fallback={
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          }
        >
          <RecentContracts limit={5} />
        </Suspense>

        <Suspense
          fallback={
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          }
        >
          <PlotBreakdown />
        </Suspense>
      </div>
    </div>
  );
}

