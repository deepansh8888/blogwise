
export function convertFileToBase64(file){
    return new Promise((resolve, reject) => {
        if(!file){
             reject('No file provided');
             return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);

    });
}