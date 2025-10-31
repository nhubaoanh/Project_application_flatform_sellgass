export const uploadToCloudinary = async (file) => {

    // tạo form này để gửi file lên cloudinary
    const data = new FormData();
    data.append("file", {
        uri: file,
        type: "image/jpeg",
        name: "upload.jpg"
    });

    // sau đó gửi kèm với tên của preset đã tạo trong cloudinary
    data.append("upload_preset", "upload_preset");

    // const cloudName = "dyhkn2xp3"; name của cloudinary của mình
    const cloudName = "dbjvxfhoy";


    // dùng cấu trúc try caht trong đó có fetch để gửi request lên cloudinary
    try {
        console.log('Uploading to Cloudinary...');
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: data
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const resData = await res.json();
        console.log('Cloudinary response:', resData);
        
        if (!resData.secure_url) {
            throw new Error('Upload failed: No secure_url in response');
        }
        
        return resData; // Return full response object
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        throw new Error(`Upload failed: ${err.message}`);
    }
}