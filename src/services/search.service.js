const { prisma } = require('../config/database');

class SearchService {
  async globalSearch(companyId, q) {
    if (!q || q.trim() === '') {
      return { leads: [], bookings: [], invoices: [] };
    }

    const query = q.trim();

    const [leads, bookings, invoices] = await Promise.all([
      // Search Leads
      prisma.lead.findMany({
        where: {
          companyId,
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
            { phone: { contains: query } },
            { company: { contains: query } },
          ],
        },
        take: 10,
      }),

      // Search Bookings
      prisma.booking.findMany({
        where: {
          companyId,
          OR: [
            { id: { contains: query } },
            { status: { contains: query } },
            {
              lead: {
                OR: [
                  { firstName: { contains: query } },
                  { lastName: { contains: query } },
                  { phone: { contains: query } },
                ],
              },
            },
          ],
        },
        include: {
          lead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          service: true,
        },
        take: 10,
      }),

      // Search Invoices
      prisma.invoice.findMany({
        where: {
          booking: {
            companyId,
          },
          OR: [
            { number: { contains: query } },
            { status: { contains: query } },
            {
              booking: {
                lead: {
                  OR: [
                    { firstName: { contains: query } },
                    { lastName: { contains: query } },
                    { phone: { contains: query } },
                  ],
                },
              },
            },
          ],
        },
        include: {
          booking: {
            include: {
              lead: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        take: 10,
      }),
    ]);

    return { leads, bookings, invoices };
  }
}

module.exports = new SearchService();
