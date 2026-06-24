const { prisma } = require('../config/database');
const { NotFoundError, ConflictError } = require('../utils/errors');

class InvoiceService {
  async getInvoices(companyId) {
    return prisma.invoice.findMany({
      where: {
        booking: {
          companyId,
        },
      },
      include: {
        booking: {
          include: {
            lead: true,
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoiceById(id, companyId) {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        booking: {
          companyId,
        },
      },
      include: {
        booking: {
          include: {
            lead: true,
            service: true,
          },
        },
      },
    });
    if (!invoice) {
      throw new NotFoundError('Invoice');
    }
    return invoice;
  }

  async createInvoice(data, companyId) {
    // 1. Verify booking exists and belongs to company
    const booking = await prisma.booking.findFirst({
      where: { id: data.bookingId, companyId },
    });
    if (!booking) {
      throw new NotFoundError('Booking');
    }

    // 2. Check if invoice already exists for this booking
    const existing = await prisma.invoice.findUnique({
      where: { bookingId: data.bookingId },
    });
    if (existing) {
      throw new ConflictError('An invoice has already been created for this booking');
    }

    // 3. Generate sequential invoice number
    const count = await prisma.invoice.count();
    const number = `INV-${1000 + count + 1}`;

    // 4. Create the invoice
    return prisma.invoice.create({
      data: {
        ...data,
        number,
      },
      include: {
        booking: {
          include: {
            lead: true,
            service: true,
          },
        },
      },
    });
  }

  async updateInvoice(id, data, companyId) {
    const invoice = await this.getInvoiceById(id, companyId);
    
    return prisma.invoice.update({
      where: { id },
      data,
      include: {
        booking: {
          include: {
            lead: true,
            service: true,
          },
        },
      },
    });
  }

  async deleteInvoice(id, companyId) {
    await this.getInvoiceById(id, companyId);
    await prisma.invoice.delete({ where: { id } });
    return { success: true };
  }
}

module.exports = new InvoiceService();
