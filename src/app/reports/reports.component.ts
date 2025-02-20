import { Component, OnInit, ViewChild, effect, signal } from '@angular/core';
import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  ChartTypeRegistry,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatSelectModule } from '@angular/material/select';
import { ReportService } from '../services/reports.service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  chartTypes = [
    {
      id: 0,
      ChartType: 'line' as keyof ChartTypeRegistry,
      viewValue: 'Line Chart',
      options: <ChartOptions<'line'>>{
        responsive: true,
        maintainAspectRatio: true,
        elements: { line: { tension: 0.5 } },
        plugins: { legend: { display: false } },
        scales: {
          y: { position: 'left', title: { display: true, text: 'Idea Count' } },
          // title: { display: true, text: 'Idea Count' },
          // y1: {
          //   position: 'right',
          //   grid: { color: 'rgba(255,0,0,0.3)' },
          //   ticks: { color: 'red' },
          // },
        },
      },
    },
    {
      id: 1,
      ChartType: 'bar' as keyof ChartTypeRegistry,
      viewValue: 'Bar Chart',
      options: <ChartOptions<'bar'>>{
        responsive: true,
        maintainAspectRatio: true,
        hover: { mode: 'index' },
        scales: {
          y: { position: 'left', title: { display: true, text: 'Idea Count' } },
        },
        plugins: { legend: { display: false } },
      },
    },
  ];

  // Dropdown control for chart type
  chartTypeControl = new FormControl(this.chartTypes[0], Validators.required);

  // Reactive signal to track chart options dynamically
  chartOptions = signal<ChartOptions<ChartType>>(this.chartTypes[0].options);

  chartData: ChartData<ChartType> = {
    labels: [],
    datasets: [],
  };

  reportData: any[] = [];

  constructor(private reportSrvc: ReportService) {
    // Listen for changes in the dropdown and update chart options
    effect(() => {
      const selectedChart = this.chartTypeControl.value;
      if (selectedChart) {
        this.chartOptions.set(selectedChart.options);
        this.chart?.update(); // Refresh the chart
      }
    });
  }

  ngOnInit(): void {
    // Fetch initial data
    this.fetchData();
  }

  fetchData() {
    this.reportSrvc.getData().subscribe((res) => {
      this.reportData = res;
      this.chartData = this.transformData(this.reportData);
    });
  }

  transformData(data: any[]): ChartData {
    const xValue = data.map((x) => x.status);
    const yValue = data.map((y) => y.count);

    // Generate different colors for each bar dynamically
    // const backgroundColors = data.map(
    //   () =>
    //     `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
    //       Math.random() * 255
    //     )}, ${Math.floor(Math.random() * 255)}, 0.7)`
    // );
    const predefinedColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
    ];
    const backgroundColors = data.map(
      (_, index) => predefinedColors[index % predefinedColors.length]
    );
    return {
      labels: xValue,
      datasets: [
        {
          label: 'Idea Count',
          data: yValue,
          backgroundColor: backgroundColors, // ✅ Set different colors
          borderColor: backgroundColors.map((color) =>
            color.replace('0.7', '1')
          ), // Make borders solid
          borderWidth: 1,
          hoverBackgroundColor: backgroundColors.map((color) =>
            color.replace('0.7', '0.9')
          ), // Slightly darker on hover
        },
      ],
    };
  }
}
