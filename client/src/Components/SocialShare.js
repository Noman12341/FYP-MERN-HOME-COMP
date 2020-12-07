import React from 'react';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, TwitterShareButton, RedditShareButton, LinkedinShareButton, RedditIcon, TwitterIcon, WhatsappIcon, LinkedinIcon } from "react-share";
function SocialShare(props) {
    return <div className="social-icons-container">
        <FacebookShareButton url={window.location.href}>
            <FacebookIcon size={36} borderRadius={36} />
        </FacebookShareButton>
        <WhatsappShareButton url={window.location.href} >
            <WhatsappIcon size={36} borderRadius={36} />
        </WhatsappShareButton>
        <TwitterShareButton url={window.location.href}>
            <TwitterIcon size={36} borderRadius={36} />
        </TwitterShareButton>
        <RedditShareButton url={window.location.href}>
            <RedditIcon size={36} borderRadius={36} />
        </RedditShareButton>
        <LinkedinShareButton url={window.location.href}>
            <LinkedinIcon size={36} borderRadius={36} />
        </LinkedinShareButton>
    </div>;
}
export default SocialShare;