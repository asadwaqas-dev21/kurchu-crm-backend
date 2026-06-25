const { prisma } = require('../config/database');
const { NotFoundError } = require('../utils/errors');

class BookingService {
  async getBookings(companyId, query = {}) {
    const where = { companyId, ...query };
    return prisma.booking.findMany({
      where,
      include: {
        lead: true,
        service: true,
        itinerary: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id, companyId) {
    const booking = await prisma.booking.findFirst({
      where: { id, companyId },
      include: {
        lead: true,
        service: true,
        itinerary: true,
      },
    });
    if (!booking) {
      throw new NotFoundError('Booking');
    }
    return booking;
  }

  async createBooking(data, companyId) {
    // Validate lead and service exist and belong to company
    const lead = await prisma.lead.findFirst({ where: { id: data.leadId, companyId } });
    if (!lead) throw new NotFoundError('Lead');

    const service = await prisma.service.findFirst({ where: { id: data.serviceId, companyId } });
    if (!service) throw new NotFoundError('Service');

    const pendingAmount = data.amount - data.collectedAmount;

    return prisma.booking.create({
      data: {
        ...data,
        pendingAmount,
        companyId,
      },
      include: {
        lead: true,
        service: true,
      },
    });
  }

  async updateBooking(id, data, companyId) {
    const booking = await this.getBookingById(id, companyId);
    
    // Recalculate pending amount if collectedAmount changes
    let pendingAmount = booking.pendingAmount;
    if (data.collectedAmount !== undefined) {
      pendingAmount = booking.amount - data.collectedAmount;
    }

    return prisma.booking.update({
      where: { id },
      data: {
        ...data,
        pendingAmount,
      },
      include: {
        lead: true,
        service: true,
      },
    });
  }

  async deleteBooking(id, companyId) {
    await this.getBookingById(id, companyId);
    await prisma.invoice.deleteMany({ where: { bookingId: id } });
    await prisma.alert.deleteMany({ where: { bookingId: id } });
    await prisma.booking.delete({ where: { id } });
    return { success: true };
  }
}

module.exports = new BookingService();
