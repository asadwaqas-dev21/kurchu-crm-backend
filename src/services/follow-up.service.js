const followUpRepository = require('../repositories/follow-up.repository');
const { NotFoundError } = require('../utils/errors');

class FollowUpService {
  async getFollowUps(companyId, query = {}) {
    return followUpRepository.findAll(companyId, query);
  }

  async getFollowUpById(id, companyId) {
    const followUp = await followUpRepository.findById(id, companyId);
    if (!followUp) {
      throw new NotFoundError('Follow-up');
    }
    return followUp;
  }

  async createFollowUp(data, companyId) {
    return followUpRepository.create(data);
  }

  async updateFollowUp(id, data, companyId) {
    if (data.isCompleted) {
      data.completedAt = new Date();
    }
    const followUp = await followUpRepository.update(id, companyId, data);
    if (!followUp) {
      throw new NotFoundError('Follow-up');
    }
    return followUp;
  }

  async deleteFollowUp(id, companyId) {
    const followUp = await followUpRepository.delete(id, companyId);
    if (!followUp) {
      throw new NotFoundError('Follow-up');
    }
    return { success: true };
  }
}

module.exports = new FollowUpService();
