import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { Chart } from "chart.js";

@Component({
    selector: 'app-dashboard-chart',
    template: `
        <div class='charts'>
            <canvas id="chartDesempenho"></canvas>
            <canvas id="chartGastos"></canvas>
        </div>
    `,
    standalone: true
})
export class ChartComponent implements AfterViewInit, OnChanges {
    @Input() chartData: any;
    @ViewChild('chartDesempenho', { static: true }) chartDesempenhoEl!: ElementRef<HTMLCanvasElement>;
    @ViewChild('chartGastos', { static: true }) chartGastosEl!: ElementRef<HTMLCanvasElement>;

    private chartDesempenho?: Chart;
    private chartGastos?: Chart;

    ngAfterViewInit(): void {
        this.renderCharts();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['chartData'] && this.chartData) {
            this.renderCharts();
        }
    }

    renderCharts() {
        if (!this.chartData) return;

        this.chartDesempenho?.destroy();
        this.chartGastos?.destroy();

        this.chartDesempenho = new Chart(this.chartDesempenhoEl.nativeElement, {
            type: 'line',
            data: {
                labels: this.chartData.desempenho.labels,
                datasets: [{
                    label: this.chartData.desempenho.labels,
                    data: this.chartData.desempenho.valores,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { responsive: true }
        });

        this.chartGastos = new Chart(this.chartGastosEl.nativeElement, {
            type: 'doughnut',
            data: {
                labels: this.chartData.gastos.labels,
                datasets: [{
                    data: this.chartData.gastos.valores.map((v: number) => Math.abs(v)),
                    backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        })
    }
}