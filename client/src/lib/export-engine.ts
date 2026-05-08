/**
 * Export Engine - Handle data exports in multiple formats
 * Supports CSV, JSON, and TSV formats
 */

export interface ExportOptions {
  filename?: string;
  dateFormat?: string;
}

export class ExportEngine {
  /**
   * Export data as CSV
   */
  static exportAsCSV<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions = {}
  ): void {
    if (data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const filename = options.filename || `export-${Date.now()}.csv`;

    // Get headers from first object
    const headers = Object.keys(data[0]);
    const csvRows: string[] = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header];
        // Handle values with commas or quotes
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  }

  /**
   * Export data as JSON
   */
  static exportAsJSON<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions = {}
  ): void {
    const filename = options.filename || `export-${Date.now()}.json`;
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
  }

  /**
   * Export data as TSV (Tab-Separated Values)
   */
  static exportAsTSV<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions = {}
  ): void {
    if (data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const filename = options.filename || `export-${Date.now()}.tsv`;

    // Get headers from first object
    const headers = Object.keys(data[0]);
    const tsvRows: string[] = [];

    // Add header row
    tsvRows.push(headers.join('\t'));

    // Add data rows
    data.forEach((row) => {
      const values = headers.map((header) => String(row[header]));
      tsvRows.push(values.join('\t'));
    });

    const tsvContent = tsvRows.join('\n');
    this.downloadFile(tsvContent, filename, 'text/tab-separated-values;charset=utf-8;');
  }

  /**
   * Export chart data
   */
  static exportChartData(
    chartData: any[],
    format: 'csv' | 'json' | 'tsv' = 'csv',
    filename?: string
  ): void {
    const options: ExportOptions = {
      filename: filename || `chart-data-${Date.now()}.${format}`,
    };

    switch (format) {
      case 'csv':
        this.exportAsCSV(chartData, options);
        break;
      case 'json':
        this.exportAsJSON(chartData, options);
        break;
      case 'tsv':
        this.exportAsTSV(chartData, options);
        break;
    }
  }

  /**
   * Download file helper
   */
  private static downloadFile(
    content: string,
    filename: string,
    mimeType: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Copy data to clipboard as JSON
   */
  static async copyToClipboard<T extends Record<string, any>>(
    data: T[]
  ): Promise<void> {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonContent);
      console.log('Data copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      throw error;
    }
  }

  /**
   * Export table data with selected rows
   */
  static exportTableSelection<T extends Record<string, any>>(
    allData: T[],
    selectedIds: Set<string | number>,
    idKey: keyof T = 'id',
    format: 'csv' | 'json' | 'tsv' = 'csv'
  ): void {
    const selectedData = allData.filter((row) => selectedIds.has(row[idKey]));

    const filename = `selected-data-${selectedIds.size}-items.${format}`;

    switch (format) {
      case 'csv':
        this.exportAsCSV(selectedData, { filename });
        break;
      case 'json':
        this.exportAsJSON(selectedData, { filename });
        break;
      case 'tsv':
        this.exportAsTSV(selectedData, { filename });
        break;
    }
  }

  /**
   * Export metrics summary
   */
  static exportMetricsSummary(
    metrics: Array<{
      name: string;
      value: number | string;
      trend?: number;
      timestamp?: Date;
    }>,
    format: 'csv' | 'json' = 'csv'
  ): void {
    const filename = `metrics-summary-${Date.now()}.${format}`;

    const formattedMetrics = metrics.map((metric) => ({
      Metric: metric.name,
      Value: metric.value,
      Trend: metric.trend ? `${metric.trend > 0 ? '+' : ''}${metric.trend}%` : 'N/A',
      Timestamp: metric.timestamp
        ? new Date(metric.timestamp).toISOString()
        : new Date().toISOString(),
    }));

    if (format === 'csv') {
      this.exportAsCSV(formattedMetrics, { filename });
    } else {
      this.exportAsJSON(formattedMetrics, { filename });
    }
  }
}

// Helper hook for React components
export function useExportData() {
  const exportCSV = <T extends Record<string, any>>(
    data: T[],
    filename?: string
  ) => {
    ExportEngine.exportAsCSV(data, { filename });
  };

  const exportJSON = <T extends Record<string, any>>(
    data: T[],
    filename?: string
  ) => {
    ExportEngine.exportAsJSON(data, { filename });
  };

  const exportTSV = <T extends Record<string, any>>(
    data: T[],
    filename?: string
  ) => {
    ExportEngine.exportAsTSV(data, { filename });
  };

  const copyToClipboard = async <T extends Record<string, any>>(
    data: T[]
  ) => {
    await ExportEngine.copyToClipboard(data);
  };

  return {
    exportCSV,
    exportJSON,
    exportTSV,
    copyToClipboard,
    exportChartData: ExportEngine.exportChartData,
    exportMetricsSummary: ExportEngine.exportMetricsSummary,
  };
}

export default ExportEngine;
