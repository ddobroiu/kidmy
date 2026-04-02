"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    article?: boolean;
}

export default function SEO({
    title = "Kidmy - Platformă Educațională 3D pentru Copii",
    description = "Kidmy transformă imaginația copiilor în realitate 3D. Învață despre animale, creează personaje imersive și explorează lumea prin Realitate Augmentată și AI.",
    image = "/og-image.jpg",
    article = false
}: SEOProps) {
    const pathname = usePathname();
    const siteName = "Kidmy";
    const twitterHandle = "@kidmy3d";
    const url = `https://www.kidmy.ro${pathname}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": article ? "Article" : "EducationalOrganization",
        "name": siteName,
        "description": description,
        "url": url,
        "logo": "https://www.kidmy.ro/logo.png",
        "sameAs": [
            "https://www.facebook.com/kidmy3d",
            "https://www.instagram.com/kidmy3d"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+40-7xx-xxx-xxx",
            "contactType": "customer service",
            "areaServed": "RO",
            "availableLanguage": "Romanian"
        }
    };

    return (
        <>
            <title>{`${title} | ${siteName}`}</title>
            <meta name="description" content={description} />
            <meta name="image" content={image} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={article ? "article" : "website"} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={twitterHandle} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* Additional Keywords Meta for older engines (though less relevant now) */}
            <meta name="keywords" content="educatie copii, 3d pentru copii, realitate augmentata, invatare interactiva, animale 3d, inteligenta artificiala copii, creativitate digitala" />
        </>
    );
}
