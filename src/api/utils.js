export const axios_dataToFormdata = function dataToFormdata(data = {}) {
    try {
        return Object.keys(data).reduce((t, el) => {
            var value = data[el];
            if ({}.toString.call(value) === '[object Object]') {
                value = JSON.stringify(value)
            }
            t.push(el + "=" + value);
            return t;
        }, []).join('&')
    } catch (e) {
        return ""
    }
}