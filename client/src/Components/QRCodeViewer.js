import React, { useEffect, useState } from 'react';
import axios from 'axios';
function QRCodeView() {
    const userEmail = localStorage.getItem('userEmail');
    const [imgSrc, setImgSrc] = useState("");
    useEffect(() => {
        const fetchCodeImg = async () => {
            await axios.post("/api/products/fetchqrcode", { userEmail })
                .then(res => {
                    setImgSrc(res.data.img);
                }).catch(error => {
                    setImgSrc(error.response.data.img);
                });
        }
        fetchCodeImg();
    }, []);
    return imgSrc && <div className="text-center mt-4">
        <img src={"/static/QRCodes/" + imgSrc} alt="" height="200" width="200" />
    </div>

}
export default QRCodeView;