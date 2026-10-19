const PDFDocument = require('pdfkit');

/**
 * Create a PDF report
 * @param {Object} options
 * @param {string} options.title - Report title
 * @param {string} options.schoolName - School name
 * @param {Array} options.headers - Column headers
 * @param {Array} options.rows - Data rows
 * @param {Object} options.summary - Summary data (optional)
 * @returns {PDFDocument} - PDF document stream
 */
function createPdfReport({ title, schoolName, headers, rows, summary }) {
  const doc = new PDFDocument({ 
    size: 'A4', 
    layout: 'landscape',
    margin: 40 
  });

  // Header
  doc.fontSize(18).font('Helvetica-Bold').text(schoolName || 'Inventaris Sekolah', { align: 'center' });
  doc.fontSize(14).font('Helvetica').text(title, { align: 'center' });
  doc.fontSize(10).text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, { align: 'center' });
  doc.moveDown(1.5);

  // Table
  if (headers && rows) {
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = pageWidth / headers.length;
    const startX = doc.page.margins.left;
    let y = doc.y;

    // Table header
    doc.font('Helvetica-Bold').fontSize(9);
    headers.forEach((header, i) => {
      doc.text(header, startX + (i * colWidth), y, { 
        width: colWidth, 
        align: 'left' 
      });
    });
    
    y += 20;
    doc.moveTo(startX, y).lineTo(startX + pageWidth, y).stroke();
    y += 5;

    // Table rows
    doc.font('Helvetica').fontSize(8);
    rows.forEach((row) => {
      // Check if we need a new page
      if (y > doc.page.height - 80) {
        doc.addPage();
        y = doc.page.margins.top;
      }

      row.forEach((cell, i) => {
        doc.text(String(cell || ''), startX + (i * colWidth), y, { 
          width: colWidth, 
          align: 'left' 
        });
      });
      y += 18;
    });
  }

  // Summary
  if (summary) {
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(11).text('Ringkasan:', { underline: true });
    doc.font('Helvetica').fontSize(10);
    Object.entries(summary).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`);
    });
  }

  // Footer
  const footerY = doc.page.height - 40;
  doc.fontSize(8).font('Helvetica')
    .text('Inventaris Sekolah v1.0.0', doc.page.margins.left, footerY, { align: 'center' });

  return doc;
}

module.exports = { createPdfReport };
