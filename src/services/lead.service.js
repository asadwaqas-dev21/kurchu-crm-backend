const leadRepository = require('../repositories/lead.repository');
const { NotFoundError } = require('../utils/errors');

class LeadService {
  async getLeads(companyId, query = {}) {
    return leadRepository.findAll(companyId, query);
  }

  async getLeadById(id, companyId) {
    const lead = await leadRepository.findById(id, companyId);
    if (!lead) {
      throw new NotFoundError('Lead');
    }
    return lead;
  }

  async createLead(data, userId, companyId) {
    return leadRepository.create({
      ...data,
      createdById: userId,
      companyId,
    });
  }

  async updateLead(id, data, companyId) {
    const lead = await this.getLeadById(id, companyId);
    await leadRepository.update(id, companyId, data);
    return { ...lead, ...data };
  }

  async deleteLead(id, companyId) {
    await this.getLeadById(id, companyId);
    await leadRepository.delete(id, companyId);
    return { success: true };
  }
}

module.exports = new LeadService();
