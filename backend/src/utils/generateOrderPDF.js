import PDFDocument from "pdfkit";
import fs from "fs";

export const generateOrderPDF = (orders, outputPath = "orders.pdf") => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(outputPath));

  // Title
  doc.fontSize(22).text(" InventoryPro - Order Report", {
    align: "center",
    underline: true,
  });
  doc.moveDown(1.5);

  orders.forEach((order, index) => {
    const total = order.items.reduce((sum, item) => {
      return sum + item.quantity * item.priceAtPurchase;
    }, 0);

    // Order Header
    doc
      .fontSize(14)
      .fillColor("#000")
      .text(`Order #${order.orderNumber}`, { underline: true });
    doc
      .fontSize(12)
      .text(`Customer: ${order.customer?.name || "N/A"}`)
      .text(`Status: ${order.status}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown(0.5);

    // Table Headers
    doc
      .font("Helvetica-Bold")
      .text("Item", 50, doc.y, { continued: true })
      .text("Qty", 250, doc.y, { continued: true })
      .text("Price", 300, doc.y, { continued: true })
      .text("Total", 370);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Table Body
    order.items.forEach((item, idx) => {
      const name = item.product?.name || "N/A";
      const qty = item.quantity;
      const price = item.priceAtPurchase;
      const itemTotal = qty * price;

      doc
        .font("Helvetica")
        .text(`${idx + 1}. ${name}`, 50, doc.y + 5, { continued: true })
        .text(qty, 250, doc.y, { continued: true })
        .text(`₹${price}`, 300, doc.y, { continued: true })
        .text(`₹${itemTotal}`, 370);
    });

    // Total
    doc.moveDown(0.5);
    doc
      .font("Helvetica-Bold")
      .text(`Total Amount: ₹${total}`, { align: "right" });

    doc.moveDown(1.5);
  });

  doc.end();
  return outputPath;
};
