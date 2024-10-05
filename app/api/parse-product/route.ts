// /app/api/parse-product/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch'; // Optional: Remove if using Next.js 13+ built-in fetch
import * as cheerio from 'cheerio';

interface ItemData {
  name: string;
  image: string;
  price: number;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL provided.' }, { status: 400 });
    }

    const parsedUrl = new URL(url);

    if (!parsedUrl.hostname.includes('market.yandex.ru')) {
      return NextResponse.json({ error: 'Unsupported domain.' }, { status: 400 });
    }

    // Fetch the HTML content of the page
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://market.yandex.ru',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch the URL: ${url}, Status: ${response.status}`);
      return NextResponse.json({ error: 'Failed to fetch the product page.' }, { status: 500 });
    }

    const html = await response.text();

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    // Extract product name
    const name = $('h1').first().text().trim() || '';

    // Extract product description
    const description =
      $('div[aria-label="product-description"]').first().text().replace(/\n/g, ' ').trim() ||
      'No description available.';

    // Extract product price
    let priceText = $('h3[data-auto="snippet-price-current"]').first().text() || '';
    priceText = priceText.replace(/[^\d]/g, ''); // Remove non-numeric characters
    const price = parseInt(priceText, 10) || 0;

    // Extract product image
    let image = $('button[data-auto="thumbnail"] img').first().attr('src') || '';
    if (image.startsWith('//')) {
      image = 'https:' + image;
    } else if (image.startsWith('/')) {
      image = `${parsedUrl.protocol}//${parsedUrl.hostname}${image}`;
    }

    const itemData: ItemData = { name, image, price, description };

    console.log('Parsed Data:', itemData);

    // Validate extracted data
    if (!itemData.name || !itemData.price || !itemData.image) {
      return NextResponse.json({ error: 'Unable to extract product data.' }, { status: 500 });
    }

    return NextResponse.json(itemData, { status: 200 });
  } catch (error) {
    console.error('Error parsing product URL:', error);
    return NextResponse.json({ error: 'Failed to parse the product URL.' }, { status: 500 });
  }
}
