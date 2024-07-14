import axios from 'axios';

export const callApi = async (input) => {
    try {
        const res = await axios.post('/api', { data: input });
        if (res.status === 200) {
            const data = res.data;
            if (data) {
                localStorage.setItem("getData", JSON.stringify(data));
                return { success: true, error: false }
            }
        }
    }
    catch (err) {
        console.log(err)
        return { success: false, error: true }
    }
}