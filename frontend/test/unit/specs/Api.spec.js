import Api from '@/api';

describe('api.js', () => {
    it('should have a getQuestionnaire function', () => {
        expect(Api.getQuestionnaire).to.be.a('function');
    });

    it('should return true', () => {
        expect(true).to.equal(true);
    });
});
