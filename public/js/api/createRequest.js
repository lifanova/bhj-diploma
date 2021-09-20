/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let formData = new FormData();

    xhr.responseType = options.responseType;
    xhr.withCredentials = true;

    if (options.headers) {
        console.log(options.headers)
        for (let header in options.headers) {
            xhr.setRequestHeader(header, options.headers[item]);
          }
    }

    xhr.addEventListener("readystatechange", () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            options.callback(null, xhr.response)
        }
    });
    
    try {
        if (options.method === "GET") {
            let url = options.url + "?";

            for (let key in options.data) {
                url += key + "=" + options.data[key] + "&";
            }

            url = url.substring(0, url.length - 1);
            xhr.open(options.method, url);
            xhr.send();
        } else {
            for (let key in options.data) {
                formData.append(key, options.data[key]);
            }
            
            xhr.open(options.method, options.url);
            xhr.send(formData);
        }
    } catch (err) {
        options.callback(err)
    }

    return xhr;
};
