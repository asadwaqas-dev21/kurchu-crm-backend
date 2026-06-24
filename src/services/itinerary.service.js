const { prisma } = require('../config/database');
const { NotFoundError } = require('../utils/errors');

class ItineraryService {
  async getItineraries(companyId, query = {}) {
    const where = { companyId, ...query };
    return prisma.itinerary.findMany({
      where,
      include: {
        lead: true,
        booking: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getItineraryById(id, companyId) {
    const itinerary = await prisma.itinerary.findFirst({
      where: { id, companyId },
      include: {
        lead: true,
        booking: true,
      },
    });
    if (!itinerary) {
      throw new NotFoundError('Itinerary');
    }
    return itinerary;
  }

  async createItinerary(data, companyId) {
    // Validate lead exists and belongs to company
    const lead = await prisma.lead.findFirst({ where: { id: data.leadId, companyId } });
    if (!lead) throw new NotFoundError('Lead');

    if (data.bookingId) {
      const booking = await prisma.booking.findFirst({ where: { id: data.bookingId, companyId } });
      if (!booking) throw new NotFoundError('Booking');
    }

    return prisma.itinerary.create({
      data: {
        ...data,
        companyId,
      },
      include: {
        lead: true,
        booking: true,
      },
    });
  }

  async updateItinerary(id, data, companyId) {
    await this.getItineraryById(id, companyId);
    
    if (data.bookingId) {
      const booking = await prisma.booking.findFirst({ where: { id: data.bookingId, companyId } });
      if (!booking) throw new NotFoundError('Booking');
    }

    return prisma.itinerary.update({
      where: { id },
      data,
      include: {
        lead: true,
        booking: true,
      },
    });
  }

  async deleteItinerary(id, companyId) {
    await this.getItineraryById(id, companyId);
    await prisma.itinerary.delete({ where: { id } });
    return { success: true };
  }
}

module.exports = new ItineraryService();
