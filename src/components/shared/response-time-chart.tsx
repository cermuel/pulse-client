import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { Skeleton } from "#/components/shared/skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type ResponseTimeChartProps = {
  values: number[];
  loading?: boolean;
};

export function ResponseTimeChart({
  values,
  loading = false,
}: ResponseTimeChartProps) {
  const labels = values.map((_, index) => `Check ${index + 1}`);

  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: "#fb923c",
        backgroundColor: "#fb923c",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 18,
        pointHoverBackgroundColor: "#fb923c",
        pointHoverBorderColor: "#111111",
        pointHoverBorderWidth: 2,
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          title: (context) => context[0]?.label ?? "",
          label: (context) => `${context.parsed.y}ms`,
        },
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        titleFont: {
          size: 11,
          weight: "bold",
        },
        bodyFont: {
          size: 11,
        },
      },
    },
    scales: {
      y: {
        display: true,
        ticks: {
          color: "#6B7280",
          font: { size: 10 },
          callback: (value) => `${value}ms`,
        },
        grid: {
          display: true,
          color: "rgba(245,245,245,0.08)",
        },
        border: {
          color: "rgba(245,245,245,0.08)",
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return <Skeleton className="h-48 w-full rounded-none" />;
  }

  if (values.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[#555]">
        No response time data yet
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
