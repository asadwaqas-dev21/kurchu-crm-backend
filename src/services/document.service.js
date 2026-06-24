const { prisma } = require('../config/database');
const { NotFoundError } = require('../utils/errors');

class DocumentService {
  async getDocuments(companyId) {
    return prisma.document.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocumentById(id, companyId) {
    const document = await prisma.document.findFirst({
      where: { id, companyId },
    });
    if (!document) {
      throw new NotFoundError('Document');
    }
    return document;
  }

  async createDocument(data, companyId) {
    return prisma.document.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async deleteDocument(id, companyId) {
    await this.getDocumentById(id, companyId);
    await prisma.document.delete({ where: { id } });
    return { success: true };
  }
}

module.exports = new DocumentService();
