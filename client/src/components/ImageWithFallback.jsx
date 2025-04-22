import React, { useState, useEffect } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackSrc = '/default-avatar.png' }) => {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [hasError, setHasError] = useState(!src); // Start with error if no initial src

    useEffect(() => {
        // Reset error state and update src when the src prop changes
        if (src) {
            setHasError(false);
            setImgSrc(src);
        } else {
            // If src becomes null/undefined, immediately use fallback
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    }, [src, fallbackSrc]); // Rerun effect if src or fallbackSrc changes

    const handleError = () => {
        // Only update if we haven't already marked as error
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
            loading="lazy" // Add lazy loading for performance
        />
    );
};

export default ImageWithFallback;