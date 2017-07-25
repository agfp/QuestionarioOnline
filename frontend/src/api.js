import axios from 'axios';
import config from './config';

export default {
    getQuestionnaire() {
        return new Promise((resolve, reject) => {
            axios
                .get(config.baseUrl)
                .then(response => {
                    resolve(response.data);
                })
                .catch(reject);
        });
    }
};

// function getUrl(url, key) {
//     return `${config.baseUrl}/api/`;
// }
