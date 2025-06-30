import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import "./FurnitureCardStats.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Material {
  material: {
    _id: string;
    name: string;
    supplier: {
      _id: string;
      name: string;
    };
  };
  quantity: number;
}

interface FurnitureCardStatsProps {
  materials: Material[];
}

const FurnitureCardStats: React.FC<FurnitureCardStatsProps> = ({
  materials,
}) => {
  if (materials.length === 0) return null;

  const totalQuantity = materials.reduce(
    (sum, material) => sum + material.quantity,
    0
  );
  const colors = [
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF6384",
    "#C9CBCF",
  ];

  const chartData = {
    labels: materials.map(
      (material) => material.material?.name || "Matériau inconnu"
    ),
    datasets: [
      {
        data: materials.map((material) => material.quantity),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { font: { size: 10 }, padding: 10 },
      },
      tooltip: {
        callbacks: {
          label: (context: { label?: string; parsed?: number }) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = ((value / totalQuantity) * 100).toFixed(1);
            return `${label}: ${value} unités (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="furniture-card-stats">
      <h4>Répartition des matériaux</h4>
      <div className="chart-container">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default FurnitureCardStats;
