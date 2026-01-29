import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Tables } from '@/types/supabase';

// ============== EXCEL EXPORT ==============

export function exportGuestsToExcel(guests: Tables<'invitados'>[]) {
  const data = guests.map((g, i) => ({
    '#': i + 1,
    'Nombre': g.nombre?.toUpperCase() || '',
    'Vínculo': g.vinculo || '',
    'Grupo': g.grupo || '',
    'Adultos': g.adultos || 0,
    'Niños': g.ninos || 0,
    'Total Personas': (g.adultos || 0) + (g.ninos || 0),
    'Responsables': (g.responsable || []).join(', '),
    'Estado': g.estado || 'Pendiente',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 5 },   // #
    { wch: 25 },  // Nombre
    { wch: 15 },  // Vínculo
    { wch: 18 },  // Grupo
    { wch: 10 },  // Adultos
    { wch: 10 },  // Niños
    { wch: 14 },  // Total
    { wch: 25 },  // Responsables
    { wch: 15 },  // Estado
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invitados');
  
  const fileName = `Invitados_Fiesta_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportExpensesToExcel(expenses: Tables<'gastos'>[]) {
  const data = expenses.map((e, i) => {
    const pagos = (e.pagos as Record<string, number>) || {};
    const totalPagado = Object.values(pagos).reduce((sum, v) => sum + (Number(v) || 0), 0);
    const costo = Number(e.costo) || 0;
    
    return {
      '#': i + 1,
      'Concepto': e.item?.toUpperCase() || '',
      'Categoría': e.categoria || '',
      'Costo Total (S/)': costo.toFixed(2),
      'Pagado (S/)': totalPagado.toFixed(2),
      'Pendiente (S/)': Math.max(0, costo - totalPagado).toFixed(2),
      'Responsables': (e.responsable || []).join(', '),
      'Detalle Pagos': Object.entries(pagos).map(([k, v]) => `${k}: S/${v}`).join(' | '),
      'Estado': totalPagado >= costo ? 'PAGADO' : totalPagado > 0 ? 'EN PROCESO' : 'PENDIENTE',
    };
  });

  // Add totals row
  const totalCosto = expenses.reduce((sum, e) => sum + (Number(e.costo) || 0), 0);
  const totalPagado = expenses.reduce((sum, e) => {
    const pagos = (e.pagos as Record<string, number>) || {};
    return sum + Object.values(pagos).reduce((s, v) => s + (Number(v) || 0), 0);
  }, 0);

  data.push({
    '#': '' as any,
    'Concepto': 'TOTAL GENERAL',
    'Categoría': '',
    'Costo Total (S/)': totalCosto.toFixed(2),
    'Pagado (S/)': totalPagado.toFixed(2),
    'Pendiente (S/)': Math.max(0, totalCosto - totalPagado).toFixed(2),
    'Responsables': '',
    'Detalle Pagos': '',
    'Estado': '',
  });

  const ws = XLSX.utils.json_to_sheet(data);
  
  ws['!cols'] = [
    { wch: 5 },   // #
    { wch: 25 },  // Concepto
    { wch: 15 },  // Categoría
    { wch: 16 },  // Costo
    { wch: 14 },  // Pagado
    { wch: 14 },  // Pendiente
    { wch: 20 },  // Responsables
    { wch: 35 },  // Detalle
    { wch: 14 },  // Estado
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Presupuesto');
  
  const fileName = `Presupuesto_Fiesta_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// ============== PDF EXPORT ==============

export function exportGuestsToPDF(guests: Tables<'invitados'>[]) {
  const doc = new jsPDF('landscape');
  
  // Header
  doc.setFillColor(99, 102, 241); // Indigo
  doc.rect(0, 0, doc.internal.pageSize.width, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FIESTA 70 AÑOS - MAMÁ ZARA', 20, 18);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Lista de Invitados • Generado: ${new Date().toLocaleDateString('es-PE')}`, 20, 28);

  // Stats summary
  const confirmados = guests.filter(g => g.estado === 'Confirmado').length;
  const pendientes = guests.filter(g => g.estado === 'Pendiente').length;
  const totalPersonas = guests.reduce((sum, g) => sum + (g.adultos || 0) + (g.ninos || 0), 0);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.text(`Total Invitados: ${guests.length} | Confirmados: ${confirmados} | Pendientes: ${pendientes} | Total Personas: ${totalPersonas}`, 20, 45);

  // Table
  const tableData = guests.map((g, i) => [
    i + 1,
    (g.nombre || '').toUpperCase(),
    g.vinculo || '-',
    g.grupo || '-',
    g.adultos || 0,
    g.ninos || 0,
    (g.responsable || []).join(', ') || '-',
    g.estado || 'Pendiente'
  ]);

  autoTable(doc, {
    startY: 52,
    head: [['#', 'NOMBRE', 'VÍNCULO', 'GRUPO', 'ADULTOS', 'NIÑOS', 'RESPONSABLES', 'ESTADO']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { fontStyle: 'bold', cellWidth: 50 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
      4: { halign: 'center', cellWidth: 20 },
      5: { halign: 'center', cellWidth: 18 },
      6: { cellWidth: 45 },
      7: { halign: 'center', cellWidth: 25 }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 7) {
        const status = String(data.cell.raw);
        if (status === 'Confirmado') {
          data.cell.styles.fillColor = [220, 252, 231];
          data.cell.styles.textColor = [22, 163, 74];
        } else if (status === 'Pendiente') {
          data.cell.styles.fillColor = [254, 249, 195];
          data.cell.styles.textColor = [161, 98, 7];
        } else if (status === 'Cancelado') {
          data.cell.styles.fillColor = [254, 226, 226];
          data.cell.styles.textColor = [220, 38, 38];
        }
      }
    }
  });

  const fileName = `Invitados_Fiesta_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

export function exportExpensesToPDF(expenses: Tables<'gastos'>[]) {
  const doc = new jsPDF('landscape');
  
  // Header
  doc.setFillColor(16, 185, 129); // Emerald
  doc.rect(0, 0, doc.internal.pageSize.width, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FIESTA 70 AÑOS - MAMÁ ZARA', 20, 18);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Control de Presupuesto • Generado: ${new Date().toLocaleDateString('es-PE')}`, 20, 28);

  // Stats summary
  const totalCosto = expenses.reduce((sum, e) => sum + (Number(e.costo) || 0), 0);
  const totalPagado = expenses.reduce((sum, e) => {
    const pagos = (e.pagos as Record<string, number>) || {};
    return sum + Object.values(pagos).reduce((s, v) => s + (Number(v) || 0), 0);
  }, 0);
  const pendienteTotal = Math.max(0, totalCosto - totalPagado);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.text(`Total Presupuesto: S/ ${totalCosto.toFixed(2)} | Pagado: S/ ${totalPagado.toFixed(2)} | Pendiente: S/ ${pendienteTotal.toFixed(2)}`, 20, 45);

  // Table
  const tableData = expenses.map((e, i) => {
    const pagos = (e.pagos as Record<string, number>) || {};
    const pagado = Object.values(pagos).reduce((sum, v) => sum + (Number(v) || 0), 0);
    const costo = Number(e.costo) || 0;
    const estado = pagado >= costo ? 'PAGADO' : pagado > 0 ? 'EN PROCESO' : 'PENDIENTE';
    
    return [
      i + 1,
      (e.item || '').toUpperCase(),
      e.categoria || '-',
      `S/ ${costo.toFixed(2)}`,
      `S/ ${pagado.toFixed(2)}`,
      `S/ ${Math.max(0, costo - pagado).toFixed(2)}`,
      Object.entries(pagos).map(([k, v]) => `${k}: S/${v}`).join(' | ') || '-',
      estado
    ];
  });

  autoTable(doc, {
    startY: 52,
    head: [['#', 'CONCEPTO', 'CATEGORÍA', 'COSTO TOTAL', 'PAGADO', 'PENDIENTE', 'DETALLE PAGOS', 'ESTADO']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { fontStyle: 'bold', cellWidth: 40 },
      2: { cellWidth: 28 },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'right', cellWidth: 25 },
      6: { cellWidth: 60 },
      7: { halign: 'center', cellWidth: 28 }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 7) {
        const status = String(data.cell.raw);
        if (status === 'PAGADO') {
          data.cell.styles.fillColor = [220, 252, 231];
          data.cell.styles.textColor = [22, 163, 74];
        } else if (status === 'EN PROCESO') {
          data.cell.styles.fillColor = [224, 231, 255];
          data.cell.styles.textColor = [79, 70, 229];
        } else {
          data.cell.styles.fillColor = [254, 249, 195];
          data.cell.styles.textColor = [161, 98, 7];
        }
      }
    }
  });

  // Footer with totals
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  const cardWidth = 85;
  const spacing = 5;
  const startX = 16; // Margen izquierdo
  
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(startX, finalY + 10, cardWidth, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PRESUPUESTO', startX + 10, finalY + 20);
  doc.setFontSize(14);
  doc.text(`S/ ${totalCosto.toFixed(2)}`, startX + 10, finalY + 30);

  doc.setFillColor(99, 102, 241);
  doc.roundedRect(startX + cardWidth + spacing, finalY + 10, cardWidth, 25, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text('TOTAL PAGADO', startX + cardWidth + spacing + 10, finalY + 20);
  doc.setFontSize(14);
  doc.text(`S/ ${totalPagado.toFixed(2)}`, startX + cardWidth + spacing + 10, finalY + 30);

  doc.setFillColor(245, 158, 11);
  doc.roundedRect(startX + (cardWidth + spacing) * 2, finalY + 10, cardWidth, 25, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text('PENDIENTE', startX + (cardWidth + spacing) * 2 + 10, finalY + 20);
  doc.setFontSize(14);
  doc.text(`S/ ${pendienteTotal.toFixed(2)}`, startX + (cardWidth + spacing) * 2 + 10, finalY + 30);

  const fileName = `Presupuesto_Fiesta_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
