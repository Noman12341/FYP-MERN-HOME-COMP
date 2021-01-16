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
                    if (error.response.status === 400) {
                        console.log(error.response.data.msg);
                    } else {
                        console.log(error);
                    }
                });
        }
        fetchCodeImg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return imgSrc && <div className="text-center mt-4">
        <img src={"/static/QRCodes/" + imgSrc} alt="" height="200" width="200" />
    </div>

}
export default QRCodeView;