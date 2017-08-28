import axios from 'axios';

export default {
    save(key, token, set, answers) {
        return axios.post(`/questionario/${key}`, {
            token,
            set,
            answers
        });
    }
};
